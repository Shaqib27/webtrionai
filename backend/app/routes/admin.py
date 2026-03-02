from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.request import ClientRequest


router = APIRouter(prefix="/admin", tags=["Admin"])


# ==============================
# 📊 Dashboard Stats
# ==============================
@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):

    total_requests = db.query(func.count(ClientRequest.id)).scalar()
    total_revenue = db.query(func.sum(ClientRequest.revenue)).scalar() or 0

    completed = db.query(ClientRequest).filter(
        ClientRequest.status == "Completed"
    ).count()

    completion_rate = 0
    if total_requests:
        completion_rate = (completed / total_requests) * 100

    return {
        "total_requests": total_requests,
        "revenue": total_revenue,
        "completion_rate": round(completion_rate, 2)
    }


# ==============================
# 📋 Get All Requests
# ==============================
@router.get("/requests")
def get_all_requests(db: Session = Depends(get_db)):
    return db.query(ClientRequest).all()


# ==============================
# 🔄 Update Request Status
# ==============================
@router.put("/requests/{request_id}/status")
def update_status(request_id: int, status: str, db: Session = Depends(get_db)):

    req = db.query(ClientRequest).filter(
        ClientRequest.id == request_id
    ).first()

    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = status
    db.commit()

    return {"message": "Status updated successfully"}


# ==============================
# 💰 Update Revenue
# ==============================
@router.put("/requests/{request_id}/revenue")
def update_revenue(request_id: int, revenue: int, db: Session = Depends(get_db)):

    req = db.query(ClientRequest).filter(
        ClientRequest.id == request_id
    ).first()

    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.revenue = revenue
    db.commit()

    return {"message": "Revenue updated successfully"}


@router.get("/create-admin")
def create_admin_route():
    from app.core.database import SessionLocal
    from app.models.user import User
    from app.core.security import hash_password

    db = SessionLocal()

    existing = db.query(User).filter(User.email == "mdshaqib246@gmail.com").first()

    if not existing:
        admin = User(
            full_name="Saqib Hussain",
            email="mdshaqib246@gmail.com",
            password_hash=hash_password("Hussain786@#"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        db.close()
        return {"message": "Admin created"}

    db.close()
    return {"message": "Admin already exists"}