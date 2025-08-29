# Development Guide

This guide covers the technical setup, installation, and usage of the Agentic Visual Reporting system.

## Prerequisites

- Python 3.11+
- Node.js (for documentation and Observable report building)
- [uv](https://github.com/astral-sh/uv) for Python dependency management

## Environment Setup

**⚠️ Environment variables are required for the system to function.**

Create a `.env` file in the project root with the following variables:

```bash
# LLM API Keys
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
VERTEX_AI_CREDENTIALS=your_credentials_here

# Observability (Langfuse)
LANGFUSE_HOST=your_host_here
LANGFUSE_PUBLIC_KEY=your_public_key_here
LANGFUSE_SECRET_KEY=your_secret_key_here

# Object Storage (S3-compatible)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_ENDPOINT_URL=your_endpoint_url_here
AWS_CDN_BASE_URL=your_cdn_base_url_here
AWS_BUCKET=your_bucket_name_here

# Observable Notebook Builder API (https://github.com/peter-gy/observable-notebook-builder)
NB_BUILDER_API_USERNAME=your_username_here
NB_BUILDER_API_PASSWORD=your_password_here
NB_BUILDER_API_BASE_URL=your_hosted_apis_base_url_here
```

## Installation

```bash
# Install Python dependencies
uv sync

# Install Node.js dependencies (for documentation)
pnpm install
```

## Development

For interactive development and agent exploration, use Marimo:

```bash
uv run marimo edit workbench/agents.py --no-token --port 3335 --headless
```

This opens an interactive notebook interface where you can step through each agent in the pipeline and inspect their outputs.

## Usage

### Generate a Report

```python
from visxgenai.main import generate_report

generate_report(
    dataset_uri="https://raw.githubusercontent.com/your-dataset.csv",
    report_goal="I want an accessible, interesting report on the dataset.",
    report_length="At least 3 and at most 7 insights, balanced across types"
)
```

Alternatively, you can trigger an end-to-end report generation in a dedicated Marimo notebook:

```bash
uv run marimo edit workbench/e2e.py --no-token --port 3335 --headless
```

## Project Structure

- `src/visxgenai/` - Main agentic implementation using [DSPy](https://dspy.ai/)
- `workbench/` - Development notebooks and utilities
- `docs/` - Documentation and gallery of generated reports
