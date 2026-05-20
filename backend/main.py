from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from app.database import engine, Base
from app.routers import auth, products, categories, cart, orders

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GarmentStore API",
    description="AJIO-clone e-commerce REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)

# Serve static files (product images etc)
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "GarmentStore API", "version": "1.0.0"}


@app.get("/api/health", tags=["Health"])
def api_health():
    return {"status": "healthy", "database": "connected"}
