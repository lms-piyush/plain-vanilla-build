
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  // Redirect to Tutor Dashboard
  useEffect(() => {
    navigate("/tutor/dashboard");
  }, [navigate]);

  return null;
};

export default Index;
