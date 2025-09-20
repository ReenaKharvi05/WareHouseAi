from pydantic import BaseModel

# Deprecated schema placeholder to avoid imports; no fields used.
class InspectionFormCreate(BaseModel):
    pass

class InspectionFormUpdate(BaseModel):
    pass

class InspectionFormResponse(BaseModel):
    pass

class InspectionFormUpdate(InspectionFormBase):
    pass

class InspectionFormResponse(InspectionFormBase):
    idinspector_inspectionform: int

    class Config:
        from_attributes = True