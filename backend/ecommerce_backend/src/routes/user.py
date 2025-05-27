from flask import Blueprint, request, jsonify
from src.models import User, db
from src.routes.auth import token_required, admin_required

user_bp = Blueprint('user', __name__)

# User Management (Admin only)
@user_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    users = User.query.all()
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200

@user_bp.route('/users/<user_id>', methods=['GET'])
@admin_required
def get_user(current_user, user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@user_bp.route('/users/<user_id>', methods=['PUT'])
@admin_required
def update_user(current_user, user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    data = request.get_json()
    
    # Update user fields
    if 'username' in data:
        # Check if username is already taken
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'message': 'Username already exists!'}), 409
        user.username = data['username']
        
    if 'email' in data:
        # Check if email is already taken
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'message': 'Email already exists!'}), 409
        user.email = data['email']
        
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'avatar' in data:
        user.avatar = data['avatar']
    if 'role' in data:
        user.role = data['role']
    
    # Update password if provided
    if 'password' in data and data['password']:
        user.set_password(data['password'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully!',
        'user': user.to_dict()
    }), 200

@user_bp.route('/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    # Prevent self-deletion
    if current_user.id == user_id:
        return jsonify({'message': 'Cannot delete your own account!'}), 403
    
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User deleted successfully!'
    }), 200
