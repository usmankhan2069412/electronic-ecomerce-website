from flask import Blueprint, request, jsonify
import stripe
import os
from src.models import Order, OrderItem, db
from src.routes.auth import token_required
import json

payment_bp = Blueprint('payment', __name__)

# Initialize Stripe with the API key
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_51OXaMpLkjaNGkjsNGkjsNGkjsN')
endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET', 'whsec_12345')

@payment_bp.route('/create-payment-intent', methods=['POST'])
@token_required
def create_payment_intent(current_user):
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'amount' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create a PaymentIntent with the order amount and currency
        payment_intent = stripe.PaymentIntent.create(
            amount=int(data['amount'] * 100),  # Convert to cents
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
            metadata={
                'user_id': current_user.id,
                'order_items': json.dumps(data.get('items', []))
            }
        )
        
        return jsonify({
            'clientSecret': payment_intent.client_secret
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return jsonify({'error': 'Invalid signature'}), 400
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        # Extract metadata
        metadata = payment_intent.get('metadata', {})
        user_id = metadata.get('user_id')
        order_items_json = metadata.get('order_items', '[]')
        
        try:
            order_items = json.loads(order_items_json)
            
            # Calculate total amount
            total_amount = payment_intent['amount'] / 100  # Convert from cents
            
            # Create order in database
            new_order = Order(
                user_id=user_id,
                total_amount=total_amount,
                shipping_address=metadata.get('shipping_address', 'Not provided'),
                billing_address=metadata.get('billing_address', 'Not provided'),
                payment_method='stripe',
                payment_status='completed',
                status='processing'
            )
            
            db.session.add(new_order)
            db.session.commit()
            
            # Add order items
            for item in order_items:
                order_item = OrderItem(
                    order_id=new_order.id,
                    product_id=item['product_id'],
                    quantity=item['quantity'],
                    price=item['price']
                )
                db.session.add(order_item)
            
            db.session.commit()
            
        except Exception as e:
            print(f"Error processing payment: {str(e)}")
    
    return jsonify({'status': 'success'})

@payment_bp.route('/config', methods=['GET'])
def get_publishable_key():
    return jsonify({
        'publishableKey': os.environ.get('STRIPE_PUBLISHABLE_KEY', 'pk_test_51OXaMpLkjaNGkjsNGkjsNGkjsN')
    })
