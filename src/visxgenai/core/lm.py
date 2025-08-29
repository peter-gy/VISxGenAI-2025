import asyncio
import logging
from typing import Callable

import dspy
from langfuse import Langfuse
from typing_extensions import TypedDict

from ._instrumentor import DSPyInstrumentor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Instrumenting DSPy for Langfuse tracing
DSPyInstrumentor().instrument()  # type: ignore
# dspy.settings.configure(track_usage=True)  # type: ignore


def check_langfuse_connection(client: Langfuse) -> bool:
    """Check if the Langfuse connection is successful."""
    try:
        if client.auth_check():
            logger.info("Authentication to Langfuse successful.")
            return True
        else:
            logger.warning(
                "Authentication to Langfuse failed. Please check your API key and connection settings."
            )
            return False
    except Exception as e:
        logger.error(f"Error checking Langfuse connection: {e}")
        return False


class LMProviderConfig(TypedDict):
    name: str
    api_key: str
    api_base: str | None


def _find_provider_config(
    configs: list[LMProviderConfig], name: str
) -> LMProviderConfig | None:
    for config in configs:
        if config["name"] == name:
            return config
    return None


LMInitializer = Callable[[], dspy.LM]


class LMRegistry:
    def __init__(
        self,
        providers: list[LMProviderConfig],
        langfuse: Langfuse,
    ) -> None:
        self.providers = providers
        self.langfuse = langfuse

    def lm(self, model: str, **kwargs) -> dspy.LM:
        provider = model.split("/")[0]
        config = _find_provider_config(self.providers, provider)

        if not config:
            raise ValueError(f"Unknown provider: {provider}")

        return dspy.LM(
            model=model,
            **{k: v for k, v in config.items() if k not in {"name"}},
            **kwargs,
        )

    def lm_initializer(self, model: str, **kwargs) -> LMInitializer:
        """Create a callable that returns a dspy.LM instance."""

        def lm_initializer() -> dspy.LM:
            return self.lm(model, **kwargs)

        return lm_initializer


def lm_registry_from_env(env: dict) -> LMRegistry:
    langfuse = Langfuse(
        host=env["LANGFUSE_HOST"],
        public_key=env["LANGFUSE_PUBLIC_KEY"],
        secret_key=env["LANGFUSE_SECRET_KEY"],
    )
    check_langfuse_connection(langfuse)

    providers: list[LMProviderConfig] = [
        {
            "name": "anthropic",
            "api_key": env["ANTHROPIC_API_KEY"],
        },
        {
            "name": "openai",
            "api_key": env["OPENAI_API_KEY"],
        },
        {
            "name": "gemini",
            "api_key": env["GEMINI_API_KEY"],
        },
        {
            "name": "vertex_ai",
            "vertex_credentials": env["VERTEX_AI_CREDENTIALS"],
            "vertex_location": "europe-west1",
        },
        {
            "name": "openrouter",
            "api_key": env["OPENROUTER_API_KEY"],
            "api_base": "https://openrouter.ai/api/v1",
        },
    ]
    return LMRegistry(providers=providers, langfuse=langfuse)


def run_module_async(module: dspy.Module, inputs: list[dspy.Example]) -> list:
    import nest_asyncio

    nest_asyncio.apply()

    async_module = dspy.asyncify(module)

    async def run():
        tasks = [async_module(**dict(input.inputs())) for input in inputs]  # type: ignore
        return await asyncio.gather(*tasks)

    return asyncio.run(run())


def make_module_observed(
    module: dspy.Module,
    langfuse: Langfuse,
) -> dspy.Module:
    """
    Wrap an existing DSPy module instance such that all Langfuse observation IDs are tracked.
    """
    module_class = module.__class__
    observed_name = f"Observed{module_class.__name__}"

    class ObservedWrapper(dspy.Module):
        def __init__(self):
            super().__init__()
            self._module = module

        def forward(self, *args, **kwargs) -> dspy.Prediction:
            results = dict(self._module.forward(*args, **kwargs))
            metadata = {
                "trace_id": langfuse.get_current_trace_id(),
                "observation_id": langfuse.get_current_observation_id(),
            }
            return dspy.Prediction(**(results | {"__metadata__": metadata}))

    # Set the dynamic class name
    ObservedWrapper.__name__ = observed_name
    ObservedWrapper.__qualname__ = observed_name

    return ObservedWrapper()


class ObservedModule(dspy.Module):
    def __init__(self, langfuse: Langfuse):
        super().__init__()
        self.langfuse = langfuse

    def make_module_observed(self, module: dspy.Module) -> dspy.Module:
        """
        Wrap an existing DSPy module instance such that all Langfuse observation IDs are tracked.
        """
        return make_module_observed(module, self.langfuse)

    def _forward(self, *args, **kwargs) -> dspy.Prediction:
        raise NotImplementedError("Subclasses must implement _forward()")

    def forward(self, *args, **kwargs) -> dspy.Prediction:
        # Call the observed module's forward method and track the observation ID
        results = dict(self._forward(*args, **kwargs))
        metadata = {
            "trace_id": self.langfuse.get_current_trace_id(),
            "observation_id": self.langfuse.get_current_observation_id(),
        }
        return dspy.Prediction(**(results | {"__metadata__": metadata}))
