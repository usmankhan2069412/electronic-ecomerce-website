import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  requireAuth = true,
  requireAdmin = false,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication requirements
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check admin requirements
  if (requireAdmin && !isAdmin) {
    console.log("Admin access denied:", { requireAdmin, isAdmin, user: isAuthenticated ? "authenticated" : "not authenticated" });
    return <Navigate to="/" replace />;
  }
  
  // Log successful access to protected route
  console.log("Protected route access granted:", { requireAuth, requireAdmin, isAuthenticated, isAdmin });

  // If all checks pass, render the child routes
  return <Outlet />;
}
