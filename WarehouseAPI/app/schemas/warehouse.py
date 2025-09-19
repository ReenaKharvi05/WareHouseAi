from pydantic import BaseModel
from typing import Optional


class WarehouseBase(BaseModel):
    Warehouse_Name: str
    Location: Optional[str] = None
    Code: Optional[str] = None


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(BaseModel):
    Warehouse_Name: Optional[str] = None
    Location: Optional[str] = None
    Code: Optional[str] = None


class WarehouseResponse(WarehouseBase):
    Id_Warehouse: int

    class Config:
        from_attributes = True


