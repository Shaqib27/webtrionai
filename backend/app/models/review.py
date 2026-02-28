from sqlalchemy import Column, Integer, String, Boolean, Text
from app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    feedback = Column(Text)
    approved = Column(Boolean, default=False)