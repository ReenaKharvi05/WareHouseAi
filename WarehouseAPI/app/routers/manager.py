from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import SessionLocal
from ..models import Inspections, InspectionAnswers, Questions, UserWarehouseMap, Users, Warehouses, Commoditymaster
from ..schemas.inspection import ApproveRequest

router = APIRouter(prefix="/api", tags=["Manager"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/inspections")
def list_inspections(pending_only: bool = False, inspector_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Inspections)
    if pending_only:
        q = q.filter(Inspections.Status == "Pending")
    if inspector_id is not None:
        q = q.filter(Inspections.Inspector_Id == inspector_id)
    rows = q.order_by(Inspections.Created_At.desc()).all()
    # Resolve names for list
    result = []
    for i in rows:
        wh = db.query(Warehouses).filter(Warehouses.Id_Warehouse == i.Warehouse_Id).first()
        cm = db.query(Commoditymaster).filter(Commoditymaster.IdCommodity == i.Commodity_Id).first() if i.Commodity_Id else None
        ins = db.query(Users).filter(Users.idusers == i.Inspector_Id).first()
        result.append({
            "Id_Inspections": i.Id_Inspections,
            "warehouse": {"id": wh.Id_Warehouse, "name": wh.Warehouse_Name} if wh else None,
            "commodity": ({"id": cm.IdCommodity, "name": cm.Commodity_Name} if cm else None),
            "inspector": {
                "id": ins.idusers if ins else None,
                "username": ins.UserName if ins else None,
                "full_name": ins.Full_Name if ins else None,
            },
            "Created_At": i.Created_At,
            "Status": i.Status,
            "Remarks": i.Remarks,
            "Manager_Remarks": i.Manager_Remarks,
        })
    return result


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


@router.put("/inspections/{inspection_id}/review")
def review_inspection(
    inspection_id: int,
    payload: dict,
    db: Session = Depends(get_db),
):
    entity = db.query(Inspections).filter(Inspections.Id_Inspections == inspection_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Inspection not found")

    status = payload.get("status")
    remarks = payload.get("manager_remarks")
    if status not in ("Accepted", "Rejected"):
        raise HTTPException(status_code=400, detail="status must be 'Accepted' or 'Rejected'")

    entity.Status = status
    entity.Manager_Remarks = remarks
    db.commit()
    db.refresh(entity)
    wh = db.query(Warehouses).filter(Warehouses.Id_Warehouse == entity.Warehouse_Id).first()
    cm = db.query(Commoditymaster).filter(Commoditymaster.IdCommodity == entity.Commodity_Id).first() if entity.Commodity_Id else None
    ins = db.query(Users).filter(Users.idusers == entity.Inspector_Id).first()
    return {
        "Id_Inspections": entity.Id_Inspections,
        "warehouse": {"id": wh.Id_Warehouse, "name": wh.Warehouse_Name} if wh else None,
        "commodity": ({"id": cm.IdCommodity, "name": cm.Commodity_Name} if cm else None),
        "inspector": {
            "id": ins.idusers if ins else None,
            "username": ins.UserName if ins else None,
            "full_name": ins.Full_Name if ins else None,
        },
        "Created_At": entity.Created_At,
        "Status": entity.Status,
        "Manager_Remarks": entity.Manager_Remarks,
    }


@router.get("/managers/{manager_id}/inspectors")
def get_inspectors_under_manager(manager_id: int, db: Session = Depends(get_db)):
    sub = (
        db.query(UserWarehouseMap.User_id)
        .filter(UserWarehouseMap.Manager_id == manager_id)
        .distinct()
        .subquery()
    )
    rows = db.query(Users).filter(Users.idusers.in_(sub)).all()
    return [
        {
            "id": u.idusers,
            "UserName": u.UserName,
            "Full_Name": u.Full_Name,
            "EmailId": u.EmailId,
            "Role": u.Role,
        }
        for u in rows
    ]


@router.get("/managers/{manager_id}/inspections")
def get_manager_inspections(manager_id: int, status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Inspections).filter(Inspections.Manager_Id == manager_id)
    if status:
        if status not in ("Pending", "Accepted", "Rejected"):
            raise HTTPException(status_code=400, detail="Invalid status")
        q = q.filter(Inspections.Status == status)
    rows = q.order_by(Inspections.Created_At.desc()).all()
    result = []
    for i in rows:
        wh = db.query(Warehouses).filter(Warehouses.Id_Warehouse == i.Warehouse_Id).first()
        cm = db.query(Commoditymaster).filter(Commoditymaster.IdCommodity == i.Commodity_Id).first() if i.Commodity_Id else None
        ins = db.query(Users).filter(Users.idusers == i.Inspector_Id).first()
        result.append({
            "Id_Inspections": i.Id_Inspections,
            "warehouse": {"id": wh.Id_Warehouse, "name": wh.Warehouse_Name} if wh else None,
            "commodity": ({"id": cm.IdCommodity, "name": cm.Commodity_Name} if cm else None),
            "inspector": {
                "id": ins.idusers if ins else None,
                "username": ins.UserName if ins else None,
                "full_name": ins.Full_Name if ins else None,
            },
            "Created_At": i.Created_At,
            "Status": i.Status,
            "Manager_Remarks": i.Manager_Remarks,
        })
    return result


