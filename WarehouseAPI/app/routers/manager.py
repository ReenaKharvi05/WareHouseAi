from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import SessionLocal
from ..models import Inspections, InspectionAnswers, Questions
from ..schemas.inspection import ApproveRequest

router = APIRouter(prefix="/api", tags=["Manager"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/inspections")
def list_inspections(pending_only: bool = False, db: Session = Depends(get_db)):
    q = db.query(Inspections)
    if pending_only:
        q = q.filter(Inspections.Manager_Approved == 0)
    return [
        {
            "Id_Inspections": i.Id_Inspections,
            "Warehouse_Id": i.Warehouse_Id,
            "Inspector_Id": i.Inspector_Id,
            "Manager_Id": i.Manager_Id,
            "Created_At": i.Created_At,
            "Status": i.Status,
            "Remarks": i.Remarks,
        }
        for i in q.order_by(Inspections.Created_At.desc()).all()
    ]


@router.get("/inspection-answers/{inspection_id}")
def get_answers(inspection_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(InspectionAnswers, Questions)
        .join(Questions, Questions.id == InspectionAnswers.question_id)
        .filter(InspectionAnswers.inspection_id == inspection_id)
        .all()
    )
    return [
        {
            "question_id": ans.question_id,
            "question_text": q.text_,
            "answer": ans.answer,
            "remarks": ans.remarks,
        }
        for ans, q in rows
    ]


@router.post("/managers/{manager_id}/approve")
def approve_inspection(manager_id: int, payload: ApproveRequest, inspection_id: int, db: Session = Depends(get_db)):
    entity = db.query(Inspections).filter(Inspections.Id_Inspections == inspection_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Inspection not found")
    entity.Manager_Id = manager_id
    entity.Manager_Approved = 1 if payload.approved else 0
    entity.Manager_Remarks = payload.remarks
    db.commit()
    return {"approved": bool(entity.Manager_Approved)}


