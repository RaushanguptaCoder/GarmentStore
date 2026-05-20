from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("", response_model=List[schemas.CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    """Return top-level categories with nested children."""
    categories = (
        db.query(models.Category)
        .options(joinedload(models.Category.children))
        .filter(models.Category.parent_id.is_(None))
        .order_by(models.Category.sort_order)
        .all()
    )
    return categories


@router.get("/{slug}", response_model=schemas.CategoryOut)
def get_category(slug: str, db: Session = Depends(get_db)):
    cat = (
        db.query(models.Category)
        .options(joinedload(models.Category.children))
        .filter(models.Category.slug == slug)
        .first()
    )
    if not cat:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Category not found")
    return cat
