from pydantic import BaseModel
from pydantic import BaseModel,ConfigDict

class ProjectStatusUpdate(BaseModel):
    status: str
    
class ProjectBase(BaseModel):
    title: str
    category: str
    description: str | None = None
    featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    model_config = ConfigDict(from_attributes=True)