from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import SessionLocal
from ..schemas.warehouse import WarehouseCreate, WarehouseUpdate, WarehouseResponse
from ..services import warehouse_service


router = APIRouter(prefix="/warehouses", tags=["Warehouses"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=WarehouseResponse, status_code=status.HTTP_201_CREATED)
def create(payload: WarehouseCreate, db: Session = Depends(get_db)):
    return warehouse_service.create_warehouse(db, payload)


@router.get("/", response_model=List[WarehouseResponse])
def list_all(db: Session = Depends(get_db)):
    return warehouse_service.list_warehouses(db)


# @router.get("/{warehouse_id}", response_model=WarehouseResponse)
# def get_by_id(warehouse_id: int, db: Session = Depends(get_db)):
#     entity = warehouse_service.get_warehouse(db, warehouse_id)
#     if entity is None:
#         raise HTTPException(status_code=404, detail="Warehouse not found")
#     return entity


@router.put("/{warehouse_id}", response_model=WarehouseResponse)
def update(warehouse_id: int, payload: WarehouseUpdate, db: Session = Depends(get_db)):
    entity = warehouse_service.update_warehouse(db, warehouse_id, payload)
    if entity is None:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return entity


@router.delete("/{warehouse_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(warehouse_id: int, db: Session = Depends(get_db)):
    ok = warehouse_service.delete_warehouse(db, warehouse_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return None


