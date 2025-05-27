# ElectroStore - Modern E-commerce Platform

ElectroStore is a full-stack e-commerce application for electronic devices with modern design, animations, complete functionality including user authentication, admin panel, Stripe payments, and dynamic content management.

## Features

### User Features
- **Authentication System**: Secure login and registration with JWT tokens
- **User Account Management**: Profile editing, avatar upload, and password management
- **Product Browsing**: Browse products by category with filtering options
- **Shopping Cart**: Add/remove items, adjust quantities
- **Wishlist**: Save products for later
- **Order Management**: View order history and status
- **Dynamic Rating System**: Submit and view product ratings and reviews
- **Stripe Payments**: Secure checkout with credit card processing
- **Responsive Design**: Works on desktop and mobile devices

### Admin Features
- **Dashboard**: Analytics overview with sales data
- **Product Management**: Add, edit, and delete products dynamically
- **Category Management**: Create and manage product categories
- **Order Management**: Process orders and update status
- **User Management**: Manage user accounts and permissions
- **Rating Management**: Moderate product reviews and ratings

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Modern UI components with animations
- Stripe Elements for payment UI

### Backend
- Flask (Python) RESTful API
- JWT authentication
- SQLAlchemy ORM
- MySQL database
- Stripe API integration

## Getting Started

### Prerequisites
- Node.js and npm/pnpm
- Python 3.8+
- MySQL

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```
   cd ecommerce-app/backend/ecommerce_backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Configure the database and Stripe:
   ```
   # Set environment variables
   export DB_USERNAME=your_username
   export DB_PASSWORD=your_password
   export DB_HOST=localhost
   export DB_PORT=3306
   export DB_NAME=electro_store
   export STRIPE_SECRET_KEY=your_stripe_secret_key
   export STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   export STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

5. Run the backend server:
   ```
   python -m src.main
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd ecommerce-app/electro-store
   ```

2. Install dependencies:
   ```
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### User Access
- Register a new account or login with existing credentials
- Browse products, add to cart or wishlist
- Submit ratings and reviews for products
- Complete checkout process with Stripe payments
- View order history and manage account

### Admin Access
- Login with admin credentials
- Access admin panel via the user dropdown menu
- Manage products, categories, orders, and users
- View sales analytics
- Moderate product ratings and reviews

## Security Features
- JWT-based authentication
- Password hashing
- Role-based access control
- Protected routes
- Secure API endpoints
- Stripe payment security

## License
This project is licensed under the MIT License - see the LICENSE file for details.
