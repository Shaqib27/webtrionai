from pydantic import BaseModel, EmailStr
from typing import Optional, List

class RequestCreate(BaseModel):
    business_name: str
    website_type: str
    budget_range: str
    contact_email: EmailStr
    contact_name: str
    contact_phone: str
    industry: Optional[str] = None
    target_audience: Optional[str] = None
    design_preference: Optional[str] = None
    reference_urls: Optional[str] = None
    required_pages: Optional[str] = None
    features_needed: Optional[List[str]] = None
    deadline: Optional[str] = None
    additional_notes: Optional[str] = None
    file_url: Optional[str] = None


# ✅ ADD THIS — response schema for admin
class RequestResponse(BaseModel):
    id: int
    business_name: Optional[str]
    industry: Optional[str]
    target_audience: Optional[str]
    website_type: Optional[str]
    design_preference: Optional[str]
    reference_urls: Optional[str]
    required_pages: Optional[str]
    features_needed: Optional[str]
    budget_range: Optional[str]
    deadline: Optional[str]
    additional_notes: Optional[str]
    contact_name: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    file_url: Optional[str]
    status: Optional[str]
    revenue: Optional[int]

    class Config:
        from_attributes = True