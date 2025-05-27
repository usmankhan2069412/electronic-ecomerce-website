from flask import Blueprint, request, jsonify
from src.models import Order, OrderItem, db
from src.routes.auth import token_required, admin_required

order_bp = Blueprint('order', __name__)

# Order Management (Admin)
@order_bp.route('/admin/orders', methods=['GET'])
@admin_required
def get_all_orders(current_user):
    orders = Order.query.all()
    return jsonify({
        'orders': [order.to_dict() for order in orders]
    }), 200

@order_bp.route('/admin/orders/<order_id>', methods=['GET'])
@admin_required
def get_order_admin(current_user, order_id):
    order = Order.query.filter_by(id=order_id).first()
    if not order:
        return jsonify({'message': 'Order not found!'}), 404
    
    return jsonify({
        'order': order.to_dict()
    }), 200

@order_bp.route('/admin/orders/<order_id>', methods=['PUT'])
@admin_required
def update_order_status(current_user, order_id):
    order = Order.query.filter_by(id=order_id).first()
    if not order:
        return jsonify({'message': 'Order not found!'}), 404
    
    data = request.get_json()
    
    if 'status' in data:
        order.status = data['status']
    if 'payment_status' in data:
        order.payment_status = data['payment_status']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order updated successfully!',
        'order': order.to_dict()
    }), 200

# User Orders
@order_bp.route('/orders', methods=['GET'])
@token_required
def get_user_orders(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        'orders': [order.to_dict() for order in orders]
    }), 200

@order_bp.route('/orders/<order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    order = Order.query.filter_by(id=order_id, user_id=current_user.id).first()
    if not order:
        return jsonify({'message': 'Order not found!'}), 404
    
    return jsonify({
        'order': order.to_dict()
    }), 200

@order_bp.route('/orders', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['total_amount', 'shipping_address', 'billing_address', 'payment_method', 'items']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    # Create new order
    new_order = Order(
        user_id=current_user.id,
        total_amount=data['total_amount'],
        shipping_address=data['shipping_address'],
        billing_address=data['billing_address'],
        payment_method=data['payment_method'],
        status='pending',
        payment_status='pending'
    )
    
    db.session.add(new_order)
    db.session.commit()
    
    # Add order items
    if isinstance(data['items'], list):
        for item_data in data['items']:
            if 'product_id' in item_data and 'quantity' in item_data and 'price' in item_data:
                order_item = OrderItem(
                    order_id=new_order.id,
                    product_id=item_data['product_id'],
                    quantity=item_data['quantity'],
                    price=item_data['price']
                )
                db.session.add(order_item)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order created successfully!',
        'order': new_order.to_dict()
    }), 201

# Wishlist Management
@order_bp.route('/wishlist', methods=['GET'])
@token_required
def get_wishlist(current_user):
    wishlist_items = current_user.wishlist_items
    return jsonify({
        'wishlist': [item.to_dict() for item in wishlist_items]
    }), 200

@order_bp.route('/wishlist', methods=['POST'])
@token_required
def add_to_wishlist(current_user):
    data = request.get_json()
    
    if 'product_id' not in data:
        return jsonify({'message': 'Missing product_id!'}), 400
    
    # Check if item already in wishlist
    existing_item = WishlistItem.query.filter_by(
        user_id=current_user.id,
        product_id=data['product_id']
    ).first()
    
    if existing_item:
        return jsonify({'message': 'Item already in wishlist!'}), 409
    
    # Add to wishlist
    wishlist_item = WishlistItem(
        user_id=current_user.id,
        product_id=data['product_id']
    )
    
    db.session.add(wishlist_item)
    db.session.commit()
    
    return jsonify({
        'message': 'Item added to wishlist!',
        'wishlist_item': wishlist_item.to_dict()
    }), 201

@order_bp.route('/wishlist/<item_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(current_user, item_id):
    wishlist_item = WishlistItem.query.filter_by(
        id=item_id,
        user_id=current_user.id
    ).first()
    
    if not wishlist_item:
        return jsonify({'message': 'Wishlist item not found!'}), 404
    
    db.session.delete(wishlist_item)
    db.session.commit()
    
    return jsonify({
        'message': 'Item removed from wishlist!'
    }), 200
