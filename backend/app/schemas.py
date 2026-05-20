from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Any
from datetime import datetime


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2)
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str]
    is_active: bool
    is_admin: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ─── Category Schemas ─────────────────────────────────────────────────────────

class CategoryBase(BaseModel):
    name: str
    slug: str
    parent_id: Optional[int] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0


class CategoryOut(CategoryBase):
    id: int
    children: List["CategoryOut"] = []

    class Config:
        from_attributes = True


CategoryOut.model_rebuild()


# ─── Product Schemas ──────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    brand: str
    sku: str
    description: Optional[str] = None
    category_id: int
    price: float
    original_price: float
    discount_percentage: float = 0.0
    image_url: str
    images: List[str] = []
    sizes: List[str] = []
    colors: List[str] = []
    gender: Optional[str] = None
    material: Optional[str] = None
    fit_type: Optional[str] = None
    rating: float = 4.0
    review_count: int = 0
    stock: int = 100
    is_featured: bool = False
    is_new_arrival: bool = False
    is_best_seller: bool = False


class ProductOut(ProductBase):
    id: int
    is_active: bool
    created_at: Optional[datetime]
    category: Optional[CategoryBase] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: List[ProductOut]
    total: int
    page: int
    page_size: int
    total_pages: int


# ─── Cart Schemas ─────────────────────────────────────────────────────────────

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)
    size: Optional[str] = None
    color: Optional[str] = None


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=0)


class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    size: Optional[str]
    color: Optional[str]
    product: ProductOut

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemOut]
    subtotal: float
    total_items: int
    savings: float


# ─── Address Schemas ──────────────────────────────────────────────────────────

class AddressCreate(BaseModel):
    name: str
    phone: str
    street: str
    city: str
    state: str
    pincode: str
    is_default: bool = False


class AddressOut(AddressCreate):
    id: int

    class Config:
        from_attributes = True


# ─── Order Schemas ────────────────────────────────────────────────────────────

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    size: Optional[str]
    color: Optional[str]
    price_at_purchase: float
    product: ProductOut

    class Config:
        from_attributes = True


class CheckoutRequest(BaseModel):
    shipping_address: AddressCreate
    payment_method: str = "cod"


class OrderOut(BaseModel):
    id: int
    order_number: str
    status: str
    payment_method: Optional[str]
    payment_status: str
    subtotal: float
    discount_amount: float
    shipping_amount: float
    total_amount: float
    shipping_address: Optional[Any]
    tracking_number: Optional[str]
    created_at: Optional[datetime]
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True
