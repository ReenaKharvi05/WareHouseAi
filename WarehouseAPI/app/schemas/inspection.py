from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InspectionBase(BaseModel):
    Warehouse_Id: int
    Inspector_Id: int
    Manager_Id: int
    Data: str
    Status: str
    Remarks: Optional[str] = None

class InspectionCreate(InspectionBase):
    pass

class InspectionUpdate(BaseModel):
    Data: Optional[str] = None
    Status: Optional[str] = None
    Remarks: Optional[str] = None

class InspectionResponse(InspectionBase):
    Id_Inspections: int
    Created_At: datetime

    
class InspectionDetailsResponse(BaseModel):
    Id_Inspections: int
    Warehouse_Id: int
    Warehouse_Name: str
    Inspector_Id: int
    Inspector_Name: str
    Inspector_Role: str
    Manager_Id: int
    Manager_Name: str
    Manager_Role: str
    Created_At: datetime
    Data: str
    Status: str
    Remarks: Optional[str] = None

    class Config:
        from_attributes = True