from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import uuid

db = SQLAlchemy()

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    discount_price = db.Column(db.Float, nullable=True)
    rating = db.Column(db.Float, default=0.0)
    image = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    in_stock = db.Column(db.Boolean, default=True)
    is_new = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade="all, delete-orphan")
    features = db.relationship('ProductFeature', backref='product', lazy=True, cascade="all, delete-orphan")
    specifications = db.relationship('ProductSpecification', backref='product', lazy=True, cascade="all, delete-orphan")
    colors = db.relationship('ProductColor', backref='product', lazy=True, cascade="all, delete-orphan")
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    wishlist_items = db.relationship('WishlistItem', backref='product', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'discount_price': self.discount_price,
            'rating': self.rating,
            'image': self.image,
            'images': [img.url for img in self.images],
            'description': self.description,
            'features': [feature.text for feature in self.features],
            'specifications': {spec.key: spec.value for spec in self.specifications},
            'colors': [color.name for color in self.colors],
            'in_stock': self.in_stock,
            'is_new': self.is_new,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    
class ProductFeature(db.Model):
    __tablename__ = 'product_features'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    text = db.Column(db.String(255), nullable=False)
    
class ProductSpecification(db.Model):
    __tablename__ = 'product_specifications'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    key = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(255), nullable=False)
    
class ProductColor(db.Model):
    __tablename__ = 'product_colors'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    
class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image': self.image,
            'description': self.description
        }
