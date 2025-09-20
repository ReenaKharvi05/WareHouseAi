from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import logging

from ..database import SessionLocal
from ..models import Questions as Question
from ..schemas.question import QuestionRead

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Questions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/questions", response_model=List[QuestionRead])
def get_questions(db: Session = Depends(get_db)):
    try:
        rows = db.query(Question).all()
        return rows
    except Exception as exc:
        logger.exception("Failed to fetch questions: %s", exc)
        return []


