FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV UV_LINK_MODE=copy

WORKDIR /app

COPY pyproject.toml uv.lock ./
COPY README.md ./
COPY src ./src
COPY migrations ./migrations

RUN uv sync --frozen --no-dev

EXPOSE 5000

CMD ["uv", "run", "--no-sync", "flask", "--app", "api.api", "run", "--host=0.0.0.0", "--port=5000"]