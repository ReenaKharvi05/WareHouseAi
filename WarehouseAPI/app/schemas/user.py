from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class UserBase(BaseModel):
    UserName: str = Field(..., max_length=45)
    Full_Name: Optional[str] = Field(None, max_length=45)
    Role: str = Field(..., max_length=45)
    EmailId: Optional[EmailStr] = None
    Is_Active: Optional[int] = 1


class UserCreate(UserBase):
    Password: str = Field(..., max_length=45)


class UserUpdate(BaseModel):
    UserName: Optional[str] = Field(None, max_length=45)
    Full_Name: Optional[str] = Field(None, max_length=45)
    Role: Optional[str] = Field(None, max_length=45)
    EmailId: Optional[EmailStr] = None
    Password: Optional[str] = Field(None, max_length=45)
    Is_Active: Optional[int] = None


class UserResponse(UserBase):
    idusers: int

    class Config:
        from_attributes = True


