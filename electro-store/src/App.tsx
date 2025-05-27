import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { HomePage } from "./components/home-page";
import { ProductListingPage } from "./components/product-listing-page";
import { ProductDetailPage } from "./components/product-detail-page";
import { Cart } from "./components/cart";
import { AccountPage } from "./components/account-page";
import { ProtectedRoute } from "./components/protected-route";
import { Toaster } from "./components/ui/toaster";
import { LoginPage } from "./components/login-page";
import { RegisterPage } from "./components/register-page";
import { OrdersPage } from "./components/orders-page";
import { WishlistPage } from "./components/wishlist-page";
import { AdminDashboard } from "./components/admin/dashboard";
import { AdminProducts } from "./components/admin/products";
import { AdminOrders } from "./components/admin/orders";
import { AdminUsers } from "./components/admin/users";
import { ToastProvider } from "./components/ui/toast-context";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected User Routes */}
                <Route element={<ProtectedRoute requireAuth={true} />}>
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                </Route>
                
                {/* Admin Routes */}
                <Route element={<ProtectedRoute requireAuth={true} requireAdmin={true} />}>
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                </Route>
                
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
