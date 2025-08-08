from flask import Blueprint, request, jsonify
from src.models import db, Product, Rating
from src.routes.auth import token_required
import datetime
import uuid

rating_bp = Blueprint('rating', __name__)

# Get all ratings for a product
@rating_bp.route('/products/<product_id>/ratings', methods=['GET'])
def get_product_ratings(product_id):
    try:
        # Check if product exists
        product = Product.query.filter_by(id=product_id).first()
        if not product:
            return jsonify({'message': 'Product not found!'}), 404
        
        # Get all ratings for the product
        ratings = Rating.query.filter_by(product_id=product_id).all()
        
        # Calculate average score
        total_score = sum(rating.score for rating in ratings)
        average_score = total_score / len(ratings) if ratings else 0
        
        return jsonify({
            'average_score': round(average_score, 1),
            'total_ratings': len(ratings),
            'ratings': [rating.to_dict() for rating in ratings]
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching ratings: {str(e)}'}), 500

# Submit a new rating or update existing
@rating_bp.route('/products/<product_id>/ratings', methods=['POST'])
@token_required
def submit_rating(current_user, product_id):
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'score' not in data:
            return jsonify({'message': 'Score is required!'}), 400
        
        # Validate score range
        score = int(data['score'])
        if score < 1 or score > 5:
            return jsonify({'message': 'Score must be between 1 and 5!'}), 400
        
        # Check if product exists
        product = Product.query.filter_by(id=product_id).first()
        if not product:
            return jsonify({'message': 'Product not found!'}), 404
        
        # Check if user already rated this product
        existing_rating = Rating.query.filter_by(
            product_id=product_id,
            user_id=current_user.id
        ).first()
        
        if existing_rating:
            # Update existing rating
            existing_rating.score = score
            existing_rating.comment = data.get('comment', '')
            existing_rating.updated_at = datetime.datetime.utcnow()
            
            db.session.commit()
            
            return jsonify({
                'message': 'Rating updated successfully!',
                'rating': existing_rating.to_dict()
            }), 200
        else:
            # Create new rating
            new_rating = Rating(
                product_id=product_id,
                user_id=current_user.id,
                score=score,
                comment=data.get('comment', '')
            )
            
            db.session.add(new_rating)
            db.session.commit()
            
            # Update product rating
            ratings = Rating.query.filter_by(product_id=product_id).all()
            total_score = sum(rating.score for rating in ratings)
            average_score = total_score / len(ratings) if ratings else 0
            
            product.rating = round(average_score, 1)
            db.session.commit()
            
            return jsonify({
                'message': 'Rating submitted successfully!',
                'rating': new_rating.to_dict()
            }), 201
            
    except Exception as e:
        return jsonify({'message': f'Error submitting rating: {str(e)}'}), 500

# Delete a rating
@rating_bp.route('/ratings/<rating_id>', methods=['DELETE'])
@token_required
def delete_rating(current_user, rating_id):
    try:
        # Find the rating
        rating = Rating.query.filter_by(id=rating_id).first()
        
        if not rating:
            return jsonify({'message': 'Rating not found!'}), 404
        
        # Check if user owns the rating or is admin
        if rating.user_id != current_user.id and current_user.role != 'admin':
            return jsonify({'message': 'Unauthorized to delete this rating!'}), 403
        
        # Get product for updating average rating
        product_id = rating.product_id
        
        # Delete the rating
        db.session.delete(rating)
        db.session.commit()
        
        # Update product rating
        ratings = Rating.query.filter_by(product_id=product_id).all()
        if ratings:
            total_score = sum(rating.score for rating in ratings)
            average_score = total_score / len(ratings)
            
            product = Product.query.filter_by(id=product_id).first()
            if product:
                product.rating = round(average_score, 1)
                db.session.commit()
        
        return jsonify({
            'message': 'Rating deleted successfully!'
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error deleting rating: {str(e)}'}), 500
