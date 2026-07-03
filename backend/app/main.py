from fastapi import FastAPI

from app.api.routes.projects import router as project_router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

# Register API routes
app.include_router(project_router)


@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }