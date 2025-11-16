import marimo

__generated_with = "0.15.1"
app = marimo.App(width="columns")


@app.cell(column=0, hide_code=True)
def _(mo):
    mo.image("https://peter-gy.github.io/VISxGenAI-2025/assets/teaser.svg")
    return


@app.cell
def _(report_output):
    dict(report_output.artifacts)
    return


@app.cell
def _():
    # Challenge
    VISPUB = "https://raw.githubusercontent.com/demoPlz/mini-template/main/studio/dataset.csv"

    # Vega
    IRIS = "https://raw.githubusercontent.com/altair-viz/vega_datasets/refs/heads/master/vega_datasets/_data/iris.json"
    CARS = "https://raw.githubusercontent.com/altair-viz/vega_datasets/refs/heads/master/vega_datasets/_data/cars.json"
    DRIVING = "https://raw.githubusercontent.com/altair-viz/vega_datasets/refs/heads/master/vega_datasets/_data/driving.json"
    BARLEY = "https://raw.githubusercontent.com/altair-viz/vega_datasets/refs/heads/master/vega_datasets/_data/barley.json"

    # Ibis
    DIAMONDS = "https://visxgenai-cdn.peter.gy/datasets/ibis/diamonds.parquet"
    CARS93 = "https://visxgenai-cdn.peter.gy/datasets/ibis/Cars93.parquet"
    MSLEEP = "https://visxgenai-cdn.peter.gy/datasets/ibis/msleep.parquet"

    # Abu Dhabi - Government Open Data
    AD_782 = "https://visxgenai-cdn.peter.gy/datasets/data.abudhabi/782-Distribution%20of%20Number%20of%20Warnings%2C%20Violations%20and%20Notice%20By%20Activity%20for%20each%20Region%202024_0.xlsx"
    return (AD_782,)


@app.cell
def _(AD_782, orchestrator):
    report_output = orchestrator(
        dataset_uri=AD_782,
        report_goal="I want an understandable yet insightful report on the dataset, uncovering relationships in the data across facets.",
        report_length="At most 5-8 distinct, non-repetitive insights balanced across types",
        tags=["dev"],
    )
    return (report_output,)


@app.cell
def _(OrchestratorAgent, env, lm_registry):
    orchestrator = OrchestratorAgent(
        env=env,
        lm_registry=lm_registry,
    )
    return (orchestrator,)


@app.cell
def _(lm_registry_from_env, load_env):
    env = load_env()
    lm_registry = lm_registry_from_env(env)
    return env, lm_registry


@app.cell
def _():
    import marimo as mo
    from visxgenai.agents.orchestrator.agent import OrchestratorAgent
    from visxgenai.core import (
        lm_registry_from_env,
        load_env,
    )
    return OrchestratorAgent, lm_registry_from_env, load_env, mo


@app.cell(column=1, hide_code=True)
def _(mo, report_output):
    mo.iframe(report_output.html)
    return


if __name__ == "__main__":
    app.run()
