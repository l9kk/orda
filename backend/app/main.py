from fastapi import FastAPI

app = FastAPI(title="Orda API")

@app.get("/")
async def root():
    return {"message": "Welcome to Orda API"}
