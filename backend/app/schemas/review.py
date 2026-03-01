from pydantic import BaseModel
from typing import Optional

class ReviewCreate(BaseModel):
    client_name: str
    company: Optional[str] = None
    rating: int
    feedback: str
    approved: bool = False

class ReviewResponse(ReviewCreate):
    id: int

    class Config:
        from_attributes = True