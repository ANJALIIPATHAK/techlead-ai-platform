from fastapi import FastAPI

app = FastAPI(
    title="TechLead AI Platform",
    description="Enterprise Multi-Agent Platform",
    version="1.0.0",
)


@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "TechLead AI Platform",
        "version": "1.0.0",
    }