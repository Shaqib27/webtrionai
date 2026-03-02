# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.core.database import Base, engine
# from app.routes import projects
# from app.routes import reviews
# from app.routes import requests
# from app.routes import admin
# from app.routes import auth




# Base.metadata.create_all(bind=engine)

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://webtrionai.vercel.app"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(projects.router)
# app.include_router(reviews.router)
# app.include_router(requests.router)
# app.include_router(admin.router)
# app.include_router(auth.router)



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.routes import projects, reviews, requests, admin, auth
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

def create_admin():
    db = SessionLocal()

    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print("Admin credentials not set.")
        db.close()
        return

    existing = db.query(User).filter(User.email == admin_email).first()

    if not existing:
        admin = User(
            full_name="Saqib Hussain",
            email=admin_email,
            password=get_password_hash(admin_password),
            role="admin"
        )
        db.add(admin)
        db.commit()
        print("Admin created.")
    else:
        print("Admin already exists.")

    db.close()

@app.on_event("startup")
def startup_event():
    create_admin()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://webtrionai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(reviews.router)
app.include_router(requests.router)
app.include_router(admin.router)
app.include_router(auth.router)