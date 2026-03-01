from pydantic import BaseModel
from pydantic import BaseModel, EmailStr
from typing import Optional, List
class RequestCreate(BaseModel):
    # ✅ REQUIRED FIELDS
    business_name: str
    website_type: str
    budget_range: str
    contact_email: EmailStr
    contact_name: str
    contact_phone: str
    # OPTIONAL FIELDS
    industry: Optional[str] = None
    target_audience: Optional[str] = None
    design_preference: Optional[str] = None
    reference_urls: Optional[str] = None
    required_pages: Optional[str] = None
    features_needed: Optional[List[str]] = None
    deadline: Optional[str] = None
    additional_notes: Optional[str] = None
    file_url: Optional[str] = None