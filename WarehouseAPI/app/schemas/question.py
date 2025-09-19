from pydantic import BaseModel, Field


class QuestionRead(BaseModel):
    id: int
    # Map SQLAlchemy attribute 'text_' -> JSON field 'text'
    text: str = Field(validation_alias='text_', serialization_alias='text')
    category: str | None = None
    risk_weight: float | None = None

    class Config:
        from_attributes = True
        populate_by_name = True


