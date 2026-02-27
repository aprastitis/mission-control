from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "Mission Control Online", "message": "Backend is live!"}

@app.get("/tasks")
def get_tasks():
    # Mock data until you decide on your data storage
    return [{"id": 1, "title": "Launch Dashboard", "status": "In Progress"}]
