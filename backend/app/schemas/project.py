from pydantic import BaseModel

class ProjectBase(BaseModel):
    title: str
    category: str
    description: str | None = None
    featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        orm_mode = True