import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))  # DON'T CHANGE THIS !!!

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from src.extensions import db
from .routes import auth_bp, admin_bp, user_bp, order_bp, payment_bp, rating_bp, product_bp
import os

app = Flask(__name__)
CORS(app)

# Configure SQLAlchemy to use SQLite for testing
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(order_bp, url_prefix='/api/orders')
app.register_blueprint(payment_bp, url_prefix='/api/payment')
app.register_blueprint(rating_bp, url_prefix='/api/ratings')
app.register_blueprint(product_bp, url_prefix='/api/products')

# Create database tables
with app.app_context():
    db.create_all()

# API routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

# Serve static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
