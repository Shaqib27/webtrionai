from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewResponse
from typing import List

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("/", response_model=List[ReviewResponse])
def get_reviews(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Review).offset(skip).limit(limit).all()

@router.post("/", response_model=ReviewResponse)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    new_review = Review(**review.dict())
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review