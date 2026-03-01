from sqlalchemy import Column, Integer, String, Boolean, Text
from app.core.database import Base
from app.models.review import Review
from sqlalchemy import Column, String
from sqlalchemy import func

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text)
    featured = Column(Boolean, default=False)
    client_email = Column(String, nullable=True)
    status = Column(String, default="New")