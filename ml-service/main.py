from fastapi import FastAPI

app = FastAPI(
    title="RiskForge ML Service",
    version="1.0.0"
)


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "RiskForge ML Service",
        "status": "healthy"
    }