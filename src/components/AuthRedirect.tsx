
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're not loading
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log("Redirecting user based on role:", user.role);
        
        // Redirect based on user role
        if (user.role === "tutor") {
          navigate("/tutor/dashboard", { replace: true });
        } else if (user.role === "student" || user.role === "parent") {
          navigate("/student/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        // If not authenticated, redirect to login only if not already on auth pages
        if (!location.pathname.startsWith('/auth') && location.pathname !== '/') {
          navigate("/auth/login", { replace: true });
        }
      }
    }
  }, [user, isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthRedirect;
