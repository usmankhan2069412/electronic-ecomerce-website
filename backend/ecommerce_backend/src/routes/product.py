from flask import Blueprint, request, jsonify
from src.models.product import Product, Category
from src.extensions import db

product_bp = Blueprint('product', __name__)

# Get all products
@product_bp.route('/', methods=['GET'])
def get_products():
    # Get query parameters for filtering
    category = request.args.get('category')
    is_featured = request.args.get('featured')
    is_new = request.args.get('new')
    
    # Start with base query
    query = Product.query
    
    # Apply filters if provided
    if category:
        query = query.filter_by(category=category)
    if is_featured == 'true':
        query = query.filter_by(is_featured=True)
    if is_new == 'true':
        query = query.filter_by(is_new=True)
    
    # Execute query and convert to dict
    products = query.all()
    
    return jsonify({
        'products': [product.to_dict() for product in products]
    }), 200

# Get a specific product by ID
@product_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.filter_by(id=product_id).first()
    
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    
    return jsonify({
        'product': product.to_dict()
    }), 200

# Get all categories
@product_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    
    return jsonify({
        'categories': [category.to_dict() for category in categories]
    }), 200

# Get products by category
@product_bp.route('/categories/<category_id>/products', methods=['GET'])
def get_products_by_category(category_id):
    # Find the category
    category = Category.query.filter_by(id=category_id).first()
    
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    
    # Get products in this category
    products = Product.query.filter_by(category=category.id).all()
    
    return jsonify({
        'category': category.to_dict(),
        'products': [product.to_dict() for product in products]
    }), 200