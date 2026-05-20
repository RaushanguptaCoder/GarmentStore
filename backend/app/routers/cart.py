from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])


def calculate_cart(items: List[models.CartItem]) -> dict:
    subtotal = sum(i.product.price * i.quantity for i in items)
    original_total = sum(i.product.original_price * i.quantity for i in items)
    savings = original_total - subtotal
    return {
        "items": items,
        "subtotal": round(subtotal, 2),
        "total_items": sum(i.quantity for i in items),
        "savings": round(savings, 2),
    }


def get_cart_items(user_id: int, db: Session) -> List[models.CartItem]:
    return (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product).joinedload(models.Product.category))
        .filter(models.CartItem.user_id == user_id)
        .all()
    )


@router.get("", response_model=schemas.CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    items = get_cart_items(current_user.id, db)
    return calculate_cart(items)


@router.post("", response_model=schemas.CartResponse, status_code=201)
def add_to_cart(
    payload: schemas.CartItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    product = db.query(models.Product).filter(
        models.Product.id == payload.product_id,
        models.Product.is_active == True,
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(models.CartItem).filter(
        models.CartItem.user_id == current_user.id,
        models.CartItem.product_id == payload.product_id,
        models.CartItem.size == payload.size,
        models.CartItem.color == payload.color,
    ).first()

    if existing:
        existing.quantity += payload.quantity
    else:
        item = models.CartItem(
            user_id=current_user.id,
            product_id=payload.product_id,
            quantity=payload.quantity,
            size=payload.size,
            color=payload.color,
        )
        db.add(item)

    db.commit()
    items = get_cart_items(current_user.id, db)
    return calculate_cart(items)


@router.put("/{item_id}", response_model=schemas.CartResponse)
def update_cart_item(
    item_id: int,
    payload: schemas.CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if payload.quantity == 0:
        db.delete(item)
    else:
        item.quantity = payload.quantity

    db.commit()
    items = get_cart_items(current_user.id, db)
    return calculate_cart(items)


@router.delete("/{item_id}", response_model=schemas.CartResponse)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    items = get_cart_items(current_user.id, db)
    return calculate_cart(items)


@router.delete("", status_code=204)
def clear_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).delete()
    db.commit()
