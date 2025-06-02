
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TutorEntry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to tutor dashboard
    navigate("/tutor/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Tutor Dashboard...</h1>
        <p className="text-gray-600">Please wait while we take you to your tutor portal.</p>
      </div>
    </div>
  );
};

export default TutorEntry;
