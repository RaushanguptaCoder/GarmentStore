from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user
import uuid

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.post("", response_model=schemas.OrderOut, status_code=201)
def checkout(
    payload: schemas.CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cart_items = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))
        .filter(models.CartItem.user_id == current_user.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = sum(item.product.price * item.quantity for item in cart_items)
    shipping = 0.0 if subtotal >= 999 else 99.0
    total = subtotal + shipping

    order_number = f"AJIO{uuid.uuid4().hex[:8].upper()}"

    order = models.Order(
        order_number=order_number,
        user_id=current_user.id,
        status="confirmed",
        payment_method=payload.payment_method,
        payment_status="paid" if payload.payment_method != "cod" else "pending",
        subtotal=round(subtotal, 2),
        discount_amount=0.0,
        shipping_amount=shipping,
        total_amount=round(total, 2),
        shipping_address=payload.shipping_address.model_dump(),
    )
    db.add(order)
    db.flush()

    for cart_item in cart_items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            size=cart_item.size,
            color=cart_item.color,
            price_at_purchase=cart_item.product.price,
        )
        db.add(order_item)

    # Clear cart after checkout
    db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).delete()
    db.commit()

    return (
        db.query(models.Order)
        .options(
            joinedload(models.Order.items).joinedload(models.OrderItem.product)
            .joinedload(models.Product.category)
        )
        .filter(models.Order.id == order.id)
        .first()
    )


@router.get("", response_model=List[schemas.OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Order)
        .options(
            joinedload(models.Order.items).joinedload(models.OrderItem.product)
            .joinedload(models.Product.category)
        )
        .filter(models.Order.user_id == current_user.id)
        .order_by(models.Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    order = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.items).joinedload(models.OrderItem.product)
            .joinedload(models.Product.category)
        )
        .filter(models.Order.id == order_id, models.Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
