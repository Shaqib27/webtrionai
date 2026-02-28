from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base

class ClientRequest(Base):
    __tablename__ = "client_requests"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    website_type = Column(String)
    budget_range = Column(String)
    status = Column(String, default="New")
    additional_notes = Column(Text)