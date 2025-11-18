from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from . import models, schemas, crud
from .database import engine, get_db
from .api.v1 import receipts as receipts_router

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Receipt Processor API",
    description="API for uploading and processing receipt images",
    version="1.0.0",
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(
    receipts_router.router,
    prefix="/api/v1/receipts",
    tags=["receipts"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Receipt Processor API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Mount static files (for serving the frontend)
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
