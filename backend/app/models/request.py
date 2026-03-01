from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base

class ClientRequest(Base):
    __tablename__ = "client_requests"

    id = Column(Integer, primary_key=True, index=True)

    business_name = Column(String)
    industry = Column(String)
    target_audience = Column(Text)

    website_type = Column(String)
    design_preference = Column(String)
    reference_urls = Column(Text)
    required_pages = Column(Text)
    features_needed = Column(Text)

    budget_range = Column(String)
    deadline = Column(String)
    additional_notes = Column(Text)

    contact_name = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)

    file_url = Column(String)

    # 🔥 NEW FIELDS
    status = Column(String, default="New")
    revenue = Column(Integer, default=0)