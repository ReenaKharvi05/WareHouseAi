from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import SessionLocal
from ..models import InspectorInspectionform
from ..schemas.inceptorer import InspectionFormCreate, InspectionFormUpdate, InspectionFormResponse

router = APIRouter(prefix="/inspections", tags=["Inspections"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", response_model=InspectionFormResponse, status_code=status.HTTP_201_CREATED)
def create_inspection(payload: InspectionFormCreate, db: Session = Depends(get_db)):
    entity = InspectorInspectionform(**payload.model_dump())
    db.add(entity)
    db.commit()
    db.refresh(entity)
    return entity

@router.get("", response_model=List[InspectionFormResponse])
def list_inspections(db: Session = Depends(get_db)):
    return db.query(InspectorInspectionform).all()

# @router.get("/{inspection_id}", response_model=InspectionFormResponse)
# def get_inspection(inspection_id: int, db: Session = Depends(get_db)):
#     entity = db.query(InspectorInspectionform).filter(InspectorInspectionform.idinspector_inspectionform == inspection_id).first()
#     if not entity:
#         raise HTTPException(status_code=404, detail="Inspection not found")
#     return entity

@router.put("/{inspection_id}", response_model=InspectionFormResponse)
def update_inspection(inspection_id: int, payload: InspectionFormUpdate, db: Session = Depends(get_db)):
    entity = db.query(InspectorInspectionform).filter(InspectorInspectionform.idinspector_inspectionform == inspection_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Inspection not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(entity, k, v)
    db.commit()
    db.refresh(entity)
    return entity

@router.delete("/{inspection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inspection(inspection_id: int, db: Session = Depends(get_db)):
    entity = db.query(InspectorInspectionform).filter(InspectorInspectionform.idinspector_inspectionform == inspection_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Inspection not found")
    db.delete(entity)
    db.commit()
    return None