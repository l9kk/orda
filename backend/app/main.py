from fastapi import FastAPI
from app.core.database import engine, Base
from app.features.listings.routes import router as listings_router
from app.features.notifications.routes import router as subscriptions_router
from app.features.users.routes import router as users_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Orda API")

app.include_router(listings_router)
app.include_router(subscriptions_router)
app.include_router(users_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Orda API"}
