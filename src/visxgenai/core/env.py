from typing import Mapping

from typing_extensions import TypedDict


class AutovisEnv(TypedDict):
    # LLM API keys
    ANTHROPIC_API_KEY: str
    OPENAI_API_KEY: str
    GEMINI_API_KEY: str
    OPENROUTER_API_KEY: str
    VERTEX_AI_CREDENTIALS: str

    # Observability
    LANGFUSE_HOST: str
    LANGFUSE_PUBLIC_KEY: str
    LANGFUSE_SECRET_KEY: str

    # Object store
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_ENDPOINT_URL: str
    AWS_CDN_BASE_URL: str
    AWS_BUCKET: str

    # Observable notebook build server API
    NB_BUILDER_API_BASE_URL: str
    NB_BUILDER_API_USERNAME: str
    NB_BUILDER_API_PASSWORD: str


def _load_env_from_dict(secrets_dict: Mapping[str, str]) -> AutovisEnv:
    def get_value(key: str) -> str:
        if key not in secrets_dict:
            raise KeyError(f"Missing required environment variable: {key}")
        return secrets_dict[key]

    return AutovisEnv(
        ANTHROPIC_API_KEY=get_value("ANTHROPIC_API_KEY"),
        OPENAI_API_KEY=get_value("OPENAI_API_KEY"),
        GEMINI_API_KEY=get_value("GEMINI_API_KEY"),
        OPENROUTER_API_KEY=get_value("OPENROUTER_API_KEY"),
        VERTEX_AI_CREDENTIALS=get_value("VERTEX_AI_CREDENTIALS"),
        LANGFUSE_HOST=get_value("LANGFUSE_HOST"),
        LANGFUSE_PUBLIC_KEY=get_value("LANGFUSE_PUBLIC_KEY"),
        LANGFUSE_SECRET_KEY=get_value("LANGFUSE_SECRET_KEY"),
        AWS_ACCESS_KEY_ID=get_value("AWS_ACCESS_KEY_ID"),
        AWS_SECRET_ACCESS_KEY=get_value("AWS_SECRET_ACCESS_KEY"),
        AWS_ENDPOINT_URL=get_value("AWS_ENDPOINT_URL"),
        AWS_CDN_BASE_URL=get_value("AWS_CDN_BASE_URL"),
        AWS_BUCKET=get_value("AWS_BUCKET"),
        NB_BUILDER_API_BASE_URL=get_value("NB_BUILDER_API_BASE_URL"),
        NB_BUILDER_API_USERNAME=get_value("NB_BUILDER_API_USERNAME"),
        NB_BUILDER_API_PASSWORD=get_value("NB_BUILDER_API_PASSWORD"),
    )


def load_env() -> AutovisEnv:
    from os import environ

    return _load_env_from_dict(environ)


def load_env_from_infiscal(
    host: str,
    token: str,
    project_slug: str = "visxgenai25",
    environment_slug: str = "dev",
) -> AutovisEnv:
    from infisical_sdk import InfisicalSDKClient

    client = InfisicalSDKClient(host=host, token=token)
    secrets = client.secrets.list_secrets(
        project_slug=project_slug,
        environment_slug=environment_slug,
        secret_path="/",
    ).secrets

    secrets_dict = {secret.secretKey: secret.secretValue for secret in secrets}
    return _load_env_from_dict(secrets_dict)
