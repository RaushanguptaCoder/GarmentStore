"""Seed script — run: python seed.py"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app import models
from app.auth import hash_password

Base.metadata.create_all(bind=engine)

UNSPLASH = "https://images.unsplash.com"

CATEGORIES = [
    {"name": "Women", "slug": "women", "sort_order": 1,
     "image_url": f"{UNSPLASH}/photo-1483985988355-763728e1802?w=400", "children": [
        {"name": "Western Wear", "slug": "women-western"},
        {"name": "Ethnic Wear", "slug": "women-ethnic"},
        {"name": "Footwear", "slug": "women-footwear"},
        {"name": "Accessories", "slug": "women-accessories"},
    ]},
    {"name": "Men", "slug": "men", "sort_order": 2,
     "image_url": f"{UNSPLASH}/photo-1490481651871-ab68de25d43d?w=400", "children": [
        {"name": "Shirts", "slug": "men-shirts"},
        {"name": "T-Shirts", "slug": "men-tshirts"},
        {"name": "Jeans", "slug": "men-jeans"},
        {"name": "Footwear", "slug": "men-footwear"},
    ]},
    {"name": "Kids", "slug": "kids", "sort_order": 3,
     "image_url": f"{UNSPLASH}/photo-1471286174890-9c112ffca5b4?w=400", "children": [
        {"name": "Boys", "slug": "kids-boys"},
        {"name": "Girls", "slug": "kids-girls"},
    ]},
    {"name": "Sports", "slug": "sports", "sort_order": 4,
     "image_url": f"{UNSPLASH}/photo-1571019613454-1cb2f99b2d8b?w=400", "children": [
        {"name": "Activewear", "slug": "sports-activewear"},
        {"name": "Footwear", "slug": "sports-footwear"},
    ]},
]

PRODUCTS = [
    # Women Western
    {"name":"Floral Wrap Midi Dress","brand":"Zara","sku":"ZR-WD-001","category_slug":"women-western",
     "price":1499,"original_price":2999,"discount_percentage":50,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1539008835657-9e8e9680c956?w=600",
     "images":[f"{UNSPLASH}/photo-1515886657613-9f3515b0c78f?w=600"],
     "sizes":["XS","S","M","L","XL"],"colors":["Floral Blue","Floral Red"],
     "material":"Chiffon","rating":4.5,"review_count":320,"is_featured":True,"is_best_seller":True},
    {"name":"High-Rise Skinny Jeans","brand":"Levi's","sku":"LV-WJ-001","category_slug":"women-western",
     "price":2499,"original_price":3999,"discount_percentage":38,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1541099649105-f69ad21f3246?w=600",
     "images":[],"sizes":["26","28","30","32","34"],"colors":["Blue","Black","White"],
     "material":"Denim","rating":4.7,"review_count":580,"is_best_seller":True},
    {"name":"Satin Slip Dress","brand":"H&M","sku":"HM-WD-001","category_slug":"women-western",
     "price":999,"original_price":1999,"discount_percentage":50,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1496747611176-843222e1e57c?w=600",
     "images":[],"sizes":["XS","S","M","L"],"colors":["Champagne","Black","Dusty Rose"],
     "material":"Satin","rating":4.3,"review_count":215,"is_new_arrival":True},
    {"name":"Oversized Blazer","brand":"Mango","sku":"MG-WB-001","category_slug":"women-western",
     "price":3499,"original_price":5999,"discount_percentage":42,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1592878904946-b3cd8ae243d0?w=600",
     "images":[],"sizes":["S","M","L","XL"],"colors":["Beige","Black","White"],
     "material":"Wool Blend","rating":4.6,"review_count":178,"is_featured":True},
    {"name":"Printed Crop Top","brand":"Forever 21","sku":"F21-WT-001","category_slug":"women-western",
     "price":599,"original_price":1299,"discount_percentage":54,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1503342217505-b0a15ec3261c?w=600",
     "images":[],"sizes":["XS","S","M","L"],"colors":["White","Pink","Yellow"],
     "material":"Cotton","rating":4.1,"review_count":430,"is_new_arrival":True},

    # Women Ethnic
    {"name":"Embroidered Anarkali Kurta","brand":"Biba","sku":"BB-EK-001","category_slug":"women-ethnic",
     "price":2199,"original_price":3499,"discount_percentage":37,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1610030469983-98e550d6193c?w=600",
     "images":[],"sizes":["XS","S","M","L","XL","XXL"],"colors":["Teal","Magenta","Gold"],
     "material":"Cotton Silk","rating":4.8,"review_count":712,"is_best_seller":True,"is_featured":True},
    {"name":"Banarasi Silk Saree","brand":"Nalli","sku":"NL-SS-001","category_slug":"women-ethnic",
     "price":4999,"original_price":9999,"discount_percentage":50,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1583391733956-3750e0ff4e8b?w=600",
     "images":[],"sizes":["Free Size"],"colors":["Red","Green","Blue"],
     "material":"Pure Silk","rating":4.9,"review_count":265,"is_featured":True},
    {"name":"Flared Palazzo Set","brand":"W","sku":"W-PS-001","category_slug":"women-ethnic",
     "price":1599,"original_price":2799,"discount_percentage":43,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1594938298603-c8148c4b4f26?w=600",
     "images":[],"sizes":["XS","S","M","L","XL"],"colors":["Peach","White","Blue"],
     "material":"Rayon","rating":4.4,"review_count":389},

    # Men Shirts
    {"name":"Oxford Button-Down Shirt","brand":"Arrow","sku":"AR-MS-001","category_slug":"men-shirts",
     "price":1299,"original_price":2499,"discount_percentage":48,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1602810318383-e386cc2a3ccf?w=600",
     "images":[],"sizes":["S","M","L","XL","XXL"],"colors":["White","Light Blue","Pink"],
     "material":"100% Cotton","fit_type":"Regular Fit","rating":4.6,"review_count":540,"is_best_seller":True},
    {"name":"Slim Fit Casual Shirt","brand":"Jack & Jones","sku":"JJ-MS-001","category_slug":"men-shirts",
     "price":999,"original_price":2199,"discount_percentage":55,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1596755389378-c31d21fd1273?w=600",
     "images":[],"sizes":["S","M","L","XL"],"colors":["Navy","Black","Olive"],
     "material":"Cotton Blend","fit_type":"Slim Fit","rating":4.4,"review_count":320,"is_featured":True},
    {"name":"Linen Mandarin Collar Shirt","brand":"Peter England","sku":"PE-MS-001","category_slug":"men-shirts",
     "price":1499,"original_price":2999,"discount_percentage":50,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1604695573706-53170668f6a6?w=600",
     "images":[],"sizes":["S","M","L","XL","XXL"],"colors":["Beige","White","Sky Blue"],
     "material":"Linen","fit_type":"Regular Fit","rating":4.5,"review_count":210},

    # Men T-Shirts
    {"name":"Graphic Print Oversized Tee","brand":"H&M","sku":"HM-MT-001","category_slug":"men-tshirts",
     "price":699,"original_price":1499,"discount_percentage":53,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1583743814966-8936f5b7be1a?w=600",
     "images":[],"sizes":["S","M","L","XL","XXL"],"colors":["White","Black","Grey"],
     "material":"100% Cotton","fit_type":"Oversized","rating":4.3,"review_count":670,"is_new_arrival":True,"is_featured":True},
    {"name":"Essential V-Neck T-Shirt","brand":"US Polo","sku":"USP-MT-001","category_slug":"men-tshirts",
     "price":549,"original_price":999,"discount_percentage":45,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1521572163474-6864f9cf17ab?w=600",
     "images":[],"sizes":["S","M","L","XL","XXL"],"colors":["White","Navy","Red","Green"],
     "material":"Pima Cotton","fit_type":"Regular Fit","rating":4.5,"review_count":890,"is_best_seller":True},
    {"name":"Polo Collar T-Shirt","brand":"Lacoste","sku":"LC-MT-001","category_slug":"men-tshirts",
     "price":2999,"original_price":4999,"discount_percentage":40,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1571945153237-4929e783af4a?w=600",
     "images":[],"sizes":["S","M","L","XL"],"colors":["White","Navy","Green"],
     "material":"Pique Cotton","fit_type":"Regular Fit","rating":4.7,"review_count":430},

    # Men Jeans
    {"name":"Slim Tapered Stretch Jeans","brand":"Levi's","sku":"LV-MJ-001","category_slug":"men-jeans",
     "price":2999,"original_price":4999,"discount_percentage":40,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1542272604-787c3835535d?w=600",
     "images":[],"sizes":["28","30","32","34","36"],"colors":["Blue","Black","Grey"],
     "material":"Stretch Denim","fit_type":"Slim Tapered","rating":4.7,"review_count":920,"is_best_seller":True},
    {"name":"Straight Fit Cargo Jeans","brand":"Wrangler","sku":"WR-MJ-001","category_slug":"men-jeans",
     "price":1799,"original_price":3299,"discount_percentage":45,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1475178626620-a4d074967452?w=600",
     "images":[],"sizes":["28","30","32","34","36","38"],"colors":["Blue","Dark Blue"],
     "material":"Denim","fit_type":"Straight Fit","rating":4.4,"review_count":340,"is_new_arrival":True},

    # Sports
    {"name":"Dri-Fit Training T-Shirt","brand":"Nike","sku":"NK-ST-001","category_slug":"sports-activewear",
     "price":1999,"original_price":2999,"discount_percentage":33,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1556821840-3a63f95609a7?w=600",
     "images":[],"sizes":["S","M","L","XL","XXL"],"colors":["Black","White","Blue"],
     "material":"Dri-FIT Polyester","rating":4.6,"review_count":780,"is_featured":True,"is_best_seller":True},
    {"name":"Yoga Leggings High Waist","brand":"Adidas","sku":"AD-SL-001","category_slug":"sports-activewear",
     "price":2499,"original_price":3999,"discount_percentage":38,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1506629082955-511b1aa562c8?w=600",
     "images":[],"sizes":["XS","S","M","L","XL"],"colors":["Black","Navy","Purple"],
     "material":"Recycled Polyester","rating":4.8,"review_count":560,"is_featured":True},

    # Footwear
    {"name":"White Chunky Sneakers","brand":"Puma","sku":"PM-WF-001","category_slug":"women-footwear",
     "price":3499,"original_price":5999,"discount_percentage":42,"gender":"Women",
     "image_url":f"{UNSPLASH}/photo-1542291026-7eec264c27ff?w=600",
     "images":[],"sizes":["36","37","38","39","40","41"],"colors":["White","White/Gold"],
     "material":"Leather Upper","rating":4.5,"review_count":450,"is_new_arrival":True},
    {"name":"Men's Running Shoes","brand":"Nike","sku":"NK-MF-001","category_slug":"men-footwear",
     "price":4999,"original_price":7999,"discount_percentage":38,"gender":"Men",
     "image_url":f"{UNSPLASH}/photo-1491553895911-0055eca6402d?w=600",
     "images":[],"sizes":["7","8","9","10","11","12"],"colors":["Black","White","Blue"],
     "material":"Mesh + Foam","rating":4.8,"review_count":1200,"is_best_seller":True,"is_featured":True},

    # Kids
    {"name":"Cartoon Print T-Shirt Set","brand":"H&M Kids","sku":"HMK-BT-001","category_slug":"kids-boys",
     "price":799,"original_price":1499,"discount_percentage":47,"gender":"Kids",
     "image_url":f"{UNSPLASH}/photo-1519457431-44ccd64a579b?w=600",
     "images":[],"sizes":["2Y","4Y","6Y","8Y","10Y"],"colors":["Blue","Red","Yellow"],
     "material":"Soft Cotton","rating":4.4,"review_count":230},
    {"name":"Floral Frock Dress","brand":"Chicco","sku":"CC-GD-001","category_slug":"kids-girls",
     "price":999,"original_price":1799,"discount_percentage":44,"gender":"Kids",
     "image_url":f"{UNSPLASH}/photo-1622290291468-a28f7a7dc6a8?w=600",
     "images":[],"sizes":["2Y","4Y","6Y","8Y"],"colors":["Pink","Yellow","Lavender"],
     "material":"Cotton","rating":4.6,"review_count":180,"is_new_arrival":True},
]


def seed():
    db = SessionLocal()
    try:
        # Skip if already seeded
        if db.query(models.Category).count() > 0:
            print("Database already seeded. Skipping.")
            return

        # Create categories
        slug_to_id = {}
        for cat_data in CATEGORIES:
            children = cat_data.pop("children", [])
            cat = models.Category(**cat_data)
            db.add(cat)
            db.flush()
            slug_to_id[cat.slug] = cat.id
            for child_data in children:
                child = models.Category(**child_data, parent_id=cat.id)
                db.add(child)
                db.flush()
                slug_to_id[child.slug] = child.id

        db.commit()
        print(f"Created {len(slug_to_id)} categories")

        # Create products
        for p in PRODUCTS:
            cat_slug = p.pop("category_slug")
            cat_id = slug_to_id.get(cat_slug)
            if not cat_id:
                continue
            product = models.Product(
                **p,
                category_id=cat_id,
                description=f"Premium quality {p['name']} by {p['brand']}. "
                            f"Crafted for style and comfort.",
                stock=100,
                is_active=True,
            )
            db.add(product)

        # Create demo user
        user = models.User(
            email="demo@garmentstore.com",
            full_name="Demo User",
            phone="9876543210",
            hashed_password=hash_password("demo1234"),
        )
        db.add(user)
        db.commit()
        print(f"Created {len(PRODUCTS)} products")
        print("Seed complete! Demo login: demo@garmentstore.com / demo1234")

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()
