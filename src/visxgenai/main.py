import logging
from pathlib import Path

from .agents.orchestrator.agent import OrchestratorAgent
from .core import (
    lm_registry_from_env,
    load_env,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_report(
    dataset_uri: str,
    report_goal: str = "I want an accessible, interesting report on the dataset.",
    report_length: str = "At least 3 and at most 7 insights, balanced across types",
):
    logger.info("🔐 Loading environment variables...")
    env = load_env()

    logger.info("🌐 Initializing language model registry...")
    lm_registry = lm_registry_from_env(env)

    logger.info("🤖 Initializing Orchestrator Agent...")
    orchestrator = OrchestratorAgent(
        env=env,
        lm_registry=lm_registry,
    )

    logger.info("🚀 Starting report generation process...")
    report_output = orchestrator(
        dataset_uri=dataset_uri,
        report_goal=report_goal,
        report_length=report_length,
        tags=["eval-server"],
    )

    output_path = Path("output.html")
    logger.info(
        f"📄 Report generation complete. Saving output to {output_path.absolute()}..."
    )
    output_path.write_text(report_output.html)

    logger.info("✅ Report saved successfully.")
