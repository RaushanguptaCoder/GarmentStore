from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func
from typing import Optional, List
from app.database import get_db
from app import models, schemas
import math

router = APIRouter(prefix="/api/products", tags=["Products"])


def build_product_query(
    db: Session,
    category_slug: Optional[str] = None,
    gender: Optional[str] = None,
    brands: Optional[List[str]] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_discount: Optional[float] = None,
    colors: Optional[List[str]] = None,
    sizes: Optional[List[str]] = None,
    search: Optional[str] = None,
    is_featured: Optional[bool] = None,
    is_new_arrival: Optional[bool] = None,
    is_best_seller: Optional[bool] = None,
):
    query = (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.is_active == True)
    )

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                models.Product.name.ilike(term),
                models.Product.brand.ilike(term),
                models.Product.description.ilike(term),
            )
        )

    if category_slug:
        # Support filtering by parent category (gets all children too)
        cat = db.query(models.Category).filter(models.Category.slug == category_slug).first()
        if cat:
            child_ids = [c.id for c in cat.children] + [cat.id]
            query = query.filter(models.Product.category_id.in_(child_ids))

    if gender:
        query = query.filter(
            or_(
                models.Product.gender.ilike(gender),
                models.Product.gender == "Unisex",
            )
        )

    if brands:
        query = query.filter(models.Product.brand.in_(brands))

    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)

    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)

    if min_discount is not None:
        query = query.filter(models.Product.discount_percentage >= min_discount)

    if is_featured is not None:
        query = query.filter(models.Product.is_featured == is_featured)

    if is_new_arrival is not None:
        query = query.filter(models.Product.is_new_arrival == is_new_arrival)

    if is_best_seller is not None:
        query = query.filter(models.Product.is_best_seller == is_best_seller)

    return query


@router.get("", response_model=schemas.ProductListResponse)
def list_products(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    brand: Optional[str] = Query(None, description="Comma-separated brands"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_discount: Optional[float] = Query(None),
    color: Optional[str] = Query(None, description="Comma-separated colors"),
    size: Optional[str] = Query(None, description="Comma-separated sizes"),
    search: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    new_arrival: Optional[bool] = Query(None),
    best_seller: Optional[bool] = Query(None),
    sort: Optional[str] = Query("newest", description="newest|price_asc|price_desc|rating|discount"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    brands = [b.strip() for b in brand.split(",")] if brand else None
    colors = [c.strip() for c in color.split(",")] if color else None
    sizes = [s.strip() for s in size.split(",")] if size else None

    query = build_product_query(
        db,
        category_slug=category,
        gender=gender,
        brands=brands,
        min_price=min_price,
        max_price=max_price,
        min_discount=min_discount,
        colors=colors,
        sizes=sizes,
        search=search,
        is_featured=featured,
        is_new_arrival=new_arrival,
        is_best_seller=best_seller,
    )

    # Sorting
    if sort == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(models.Product.price.desc())
    elif sort == "rating":
        query = query.order_by(models.Product.rating.desc())
    elif sort == "discount":
        query = query.order_by(models.Product.discount_percentage.desc())
    else:
        query = query.order_by(models.Product.created_at.desc())

    total = query.count()
    products = query.offset((page - 1) * page_size).limit(page_size).all()
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "products": products,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/featured", response_model=List[schemas.ProductOut])
def get_featured_products(limit: int = Query(12), db: Session = Depends(get_db)):
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.is_active == True, models.Product.is_featured == True)
        .limit(limit)
        .all()
    )


@router.get("/new-arrivals", response_model=List[schemas.ProductOut])
def get_new_arrivals(limit: int = Query(12), db: Session = Depends(get_db)):
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.is_active == True, models.Product.is_new_arrival == True)
        .limit(limit)
        .all()
    )


@router.get("/best-sellers", response_model=List[schemas.ProductOut])
def get_best_sellers(limit: int = Query(12), db: Session = Depends(get_db)):
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.is_active == True, models.Product.is_best_seller == True)
        .limit(limit)
        .all()
    )


@router.get("/brands", response_model=List[str])
def get_brands(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Product.brand).filter(models.Product.is_active == True)
    if category:
        cat = db.query(models.Category).filter(models.Category.slug == category).first()
        if cat:
            child_ids = [c.id for c in cat.children] + [cat.id]
            query = query.filter(models.Product.category_id.in_(child_ids))
    brands = query.distinct().order_by(models.Product.brand).all()
    return [b[0] for b in brands]


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.id == product_id, models.Product.is_active == True)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
