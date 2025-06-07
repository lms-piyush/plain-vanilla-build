
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"student" | "parent" | "tutor">;
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`Access denied: User role '${user.role}' not in allowed roles:`, allowedRoles);
    
    // Redirect to appropriate dashboard based on user role
    if (user.role === "tutor") {
      return <Navigate to="/tutor/dashboard" replace />;
    } else if (user.role === "student" || user.role === "parent") {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      return <Navigate to="/auth/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
