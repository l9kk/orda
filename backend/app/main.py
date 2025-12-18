from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.features.listings.routes import router as listings_router
from app.features.notifications.routes import router as subscriptions_router
from app.features.users.routes import router as users_router
from app.features.auth.routes import router as auth_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Orda API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(listings_router)
app.include_router(subscriptions_router)
app.include_router(users_router)


@app.get("/")
async def root():
    return {"message": "Welcome to Orda API"}
