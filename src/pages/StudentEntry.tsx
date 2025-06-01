
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentEntry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to student dashboard
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Student Dashboard...</h1>
      </div>
    </div>
  );
};

export default StudentEntry;
