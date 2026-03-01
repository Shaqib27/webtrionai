from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from sqlalchemy import func
from app.models.review import Review
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse
from typing import List
from fastapi import HTTPException
router = APIRouter(prefix="/projects", tags=["Projects"])

# @router.get("/", response_model=List[ProjectResponse])
# def get_projects(db: Session = Depends(get_db)):
#     return db.query(Project).all()

@router.get("/")
def get_reviews(
    approved: bool | None = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(Review)

    if approved is not None:
        query = query.filter(Review.approved == approved)

    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{project_id}/status")
def update_project_status(project_id: int, status: str, db: Session = Depends(get_db)):

    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.status = status
    db.commit()
    db.refresh(project)

    return {"message": "Status updated", "status": project.status}

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):

    total_projects = db.query(Project).count()
    avg_rating = db.query(func.avg(Review.rating)).scalar() or 0
    happy_clients = db.query(
        func.count(func.distinct(Review.client_name))
    ).filter(Review.rating >= 4).scalar()

    return {
        "projects": total_projects,
        "clients": happy_clients,
        "satisfaction": round(avg_rating * 20),  # convert 5-star to percentage
        "years": 2  # static for now
    }


