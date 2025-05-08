
import { AuthForm } from "@/components/auth/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";

const Login = () => {
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl font-bold mb-6">
        تسجيل الدخول
      </h1>
      <AuthForm />
    </div>
  );
};

export default Login;
