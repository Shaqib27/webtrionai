from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.request import ClientRequest
from app.models.project import Project
from app.schemas.request import RequestCreate

router = APIRouter(prefix="/requests", tags=["Requests"])

@router.post("/")
def create_request(data: RequestCreate, db: Session = Depends(get_db)):

    data_dict = data.dict()

    # Convert list to string safely
    if data.features_needed:
        data_dict["features_needed"] = ",".join(data.features_needed)
    else:
        data_dict["features_needed"] = ""

    # ✅ Save request
    new_request = ClientRequest(**data_dict)
    db.add(new_request)

    # ✅ ALSO create project (so stats increase)
    new_project = Project(
        title=data.business_name,
        category=data.website_type,
        description=data.additional_notes,
        status="completed"
    )
    db.add(new_project)

    db.commit()
    db.refresh(new_request)
    db.refresh(new_project)

    return {
        "message": "Request submitted successfully",
        "project_id": new_project.id
    }