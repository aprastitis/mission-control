from fastapi import FastAPI

app = FastAPI(title="Mission Control API")

@app.get("/health")
def health():
    return {"status": "ok", "service": "mission-control-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)