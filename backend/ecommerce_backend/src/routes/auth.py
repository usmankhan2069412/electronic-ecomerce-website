from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from src.models import User, db
from src.routes.decorators import token_required, admin_required
import jwt
import datetime
import os

auth_bp = Blueprint('auth', __name__)

# Secret key for JWT
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret_key')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists!'}), 409
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists!'}), 409
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        avatar=data.get('avatar')
    )
    new_user.set_password(data['password'])
    
    # Set first user as admin
    if User.query.count() == 0:
        new_user.role = 'admin'
    
    # Save to database
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'message': 'User registered successfully!',
        'user': new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password!'}), 400
    
    # Trim username to remove any leading/trailing whitespace
    username = data['username'].strip() if data.get('username') else ''
    
    # Find user by username
    user = User.query.filter_by(username=username).first()
    
    # Debug logging
    print(f"Login attempt - Username: '{username}', User found: {user is not None}")
    
    # Check if user exists
    if not user:
        print(f"Login failed - User not found: '{username}'")
        return jsonify({'message': 'Invalid username or password!'}), 401
    
    # Check if password is correct
    password_correct = user.check_password(data['password'])
    print(f"Login attempt - Password check result: {password_correct}")
    
    if not password_correct:
        print(f"Login failed - Incorrect password for user: '{username}'")
        return jsonify({'message': 'Invalid username or password!'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    # Update user fields
    if 'first_name' in data:
        current_user.first_name = data['first_name']
    if 'last_name' in data:
        current_user.last_name = data['last_name']
    if 'avatar' in data:
        current_user.avatar = data['avatar']
    
    # Update password if provided
    if 'password' in data and data['password']:
        current_user.set_password(data['password'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully!',
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/check-auth', methods=['GET'])
@token_required
def check_auth(current_user):
    return jsonify({
        'authenticated': True,
        'user': current_user.to_dict()
    }), 200
