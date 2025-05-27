from flask import Blueprint, request, jsonify
from src.models import Product, ProductImage, ProductFeature, ProductSpecification, ProductColor, Category, db
from src.routes.auth import token_required

admin_bp = Blueprint('admin', __name__)

# Admin-only decorator
def admin_required(f):
    @token_required
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_admin():
            return jsonify({'message': 'Admin privileges required!'}), 403
        return f(current_user, *args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

# Product Management
@admin_bp.route('/products', methods=['GET'])
@admin_required
def get_all_products(current_user):
    products = Product.query.all()
    return jsonify({
        'products': [product.to_dict() for product in products]
    }), 200

@admin_bp.route('/products/<product_id>', methods=['GET'])
@admin_required
def get_product(current_user, product_id):
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({'message': 'Product not found!'}), 404
    
    return jsonify({
        'product': product.to_dict()
    }), 200

@admin_bp.route('/products', methods=['POST'])
@admin_required
def create_product(current_user):
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'category', 'price', 'image', 'description']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    # Create new product
    new_product = Product(
        name=data['name'],
        category=data['category'],
        price=data['price'],
        discount_price=data.get('discount_price'),
        image=data['image'],
        description=data['description'],
        in_stock=data.get('in_stock', True),
        is_new=data.get('is_new', False),
        is_featured=data.get('is_featured', False)
    )
    
    db.session.add(new_product)
    db.session.commit()
    
    # Add additional images
    if 'images' in data and isinstance(data['images'], list):
        for image_url in data['images']:
            product_image = ProductImage(product_id=new_product.id, url=image_url)
            db.session.add(product_image)
    
    # Add features
    if 'features' in data and isinstance(data['features'], list):
        for feature_text in data['features']:
            product_feature = ProductFeature(product_id=new_product.id, text=feature_text)
            db.session.add(product_feature)
    
    # Add specifications
    if 'specifications' in data and isinstance(data['specifications'], dict):
        for key, value in data['specifications'].items():
            product_spec = ProductSpecification(product_id=new_product.id, key=key, value=value)
            db.session.add(product_spec)
    
    # Add colors
    if 'colors' in data and isinstance(data['colors'], list):
        for color_name in data['colors']:
            product_color = ProductColor(product_id=new_product.id, name=color_name)
            db.session.add(product_color)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Product created successfully!',
        'product': new_product.to_dict()
    }), 201

@admin_bp.route('/products/<product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({'message': 'Product not found!'}), 404
    
    data = request.get_json()
    
    # Update basic product fields
    if 'name' in data:
        product.name = data['name']
    if 'category' in data:
        product.category = data['category']
    if 'price' in data:
        product.price = data['price']
    if 'discount_price' in data:
        product.discount_price = data['discount_price']
    if 'image' in data:
        product.image = data['image']
    if 'description' in data:
        product.description = data['description']
    if 'in_stock' in data:
        product.in_stock = data['in_stock']
    if 'is_new' in data:
        product.is_new = data['is_new']
    if 'is_featured' in data:
        product.is_featured = data['is_featured']
    
    # Update images
    if 'images' in data and isinstance(data['images'], list):
        # Remove existing images
        ProductImage.query.filter_by(product_id=product.id).delete()
        
        # Add new images
        for image_url in data['images']:
            product_image = ProductImage(product_id=product.id, url=image_url)
            db.session.add(product_image)
    
    # Update features
    if 'features' in data and isinstance(data['features'], list):
        # Remove existing features
        ProductFeature.query.filter_by(product_id=product.id).delete()
        
        # Add new features
        for feature_text in data['features']:
            product_feature = ProductFeature(product_id=product.id, text=feature_text)
            db.session.add(product_feature)
    
    # Update specifications
    if 'specifications' in data and isinstance(data['specifications'], dict):
        # Remove existing specifications
        ProductSpecification.query.filter_by(product_id=product.id).delete()
        
        # Add new specifications
        for key, value in data['specifications'].items():
            product_spec = ProductSpecification(product_id=product.id, key=key, value=value)
            db.session.add(product_spec)
    
    # Update colors
    if 'colors' in data and isinstance(data['colors'], list):
        # Remove existing colors
        ProductColor.query.filter_by(product_id=product.id).delete()
        
        # Add new colors
        for color_name in data['colors']:
            product_color = ProductColor(product_id=product.id, name=color_name)
            db.session.add(product_color)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Product updated successfully!',
        'product': product.to_dict()
    }), 200

@admin_bp.route('/products/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, product_id):
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({'message': 'Product not found!'}), 404
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({
        'message': 'Product deleted successfully!'
    }), 200

# Category Management
@admin_bp.route('/categories', methods=['GET'])
@admin_required
def get_all_categories(current_user):
    categories = Category.query.all()
    return jsonify({
        'categories': [category.to_dict() for category in categories]
    }), 200

@admin_bp.route('/categories', methods=['POST'])
@admin_required
def create_category(current_user):
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'image', 'description']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    # Create new category
    new_category = Category(
        name=data['name'],
        image=data['image'],
        description=data['description']
    )
    
    db.session.add(new_category)
    db.session.commit()
    
    return jsonify({
        'message': 'Category created successfully!',
        'category': new_category.to_dict()
    }), 201

@admin_bp.route('/categories/<category_id>', methods=['PUT'])
@admin_required
def update_category(current_user, category_id):
    category = Category.query.filter_by(id=category_id).first()
    if not category:
        return jsonify({'message': 'Category not found!'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        category.name = data['name']
    if 'image' in data:
        category.image = data['image']
    if 'description' in data:
        category.description = data['description']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Category updated successfully!',
        'category': category.to_dict()
    }), 200

@admin_bp.route('/categories/<category_id>', methods=['DELETE'])
@admin_required
def delete_category(current_user, category_id):
    category = Category.query.filter_by(id=category_id).first()
    if not category:
        return jsonify({'message': 'Category not found!'}), 404
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({
        'message': 'Category deleted successfully!'
    }), 200
