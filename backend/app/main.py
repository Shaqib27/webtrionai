from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routes import projects
from app.routes import reviews
from app.routes import requests
from app.routes import admin
from app.routes import auth




Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(reviews.router)
app.include_router(requests.router)
app.include_router(admin.router)
app.include_router(auth.router)