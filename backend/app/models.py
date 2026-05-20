from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    street = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    image_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)

    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent")
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(500), nullable=False)
    brand = Column(String(255), nullable=False, index=True)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=False)
    discount_percentage = Column(Float, default=0.0)

    image_url = Column(String(500), nullable=False)
    images = Column(JSON, default=list)  # additional image URLs

    sizes = Column(JSON, default=list)   # e.g. ["XS","S","M","L","XL","XXL"]
    colors = Column(JSON, default=list)  # e.g. ["Red","Black"]

    gender = Column(String(20), nullable=True)  # Men / Women / Kids / Unisex
    material = Column(String(255), nullable=True)
    fit_type = Column(String(100), nullable=True)

    rating = Column(Float, default=4.0)
    review_count = Column(Integer, default=0)
    stock = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=False)
    is_best_seller = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    cart_items = relationship("CartItem", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    size = Column(String(20), nullable=True)
    color = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    status = Column(String(50), default="pending")  # pending/confirmed/shipped/delivered/cancelled
    payment_method = Column(String(50), nullable=True)
    payment_status = Column(String(50), default="pending")

    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    shipping_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)

    shipping_address = Column(JSON, nullable=True)
    tracking_number = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    size = Column(String(20), nullable=True)
    color = Column(String(50), nullable=True)
    price_at_purchase = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
