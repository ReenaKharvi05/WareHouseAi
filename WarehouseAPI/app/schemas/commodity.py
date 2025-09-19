from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CommodityBase(BaseModel):
    Commodity_Name: str = Field(..., max_length=255)
    CommodityStorage: Optional[str] = Field(None, max_length=255)
    Description: Optional[str] = Field(None, max_length=9000)
    IsActive: Optional[int] = 1
    Category: Optional[str] = Field(None, max_length=255)


class CommodityCreate(CommodityBase):
    pass


class CommodityUpdate(BaseModel):
    Commodity_Name: Optional[str] = None
    CommodityStorage: Optional[str] = None
    Description: Optional[str] = None
    IsActive: Optional[int] = None
    Category: Optional[str] = None

class CommodityResponse(BaseModel):
    IdCommodity: int
    Commodity_Name: Optional[str] = None
    CommodityStorage: Optional[str] = None
    Description: Optional[str] = None
    IsActive: Optional[int] = None
    CreatedAt: Optional[datetime] = None
    Category: Optional[str] = None

    class Config:
        from_attributes = True


