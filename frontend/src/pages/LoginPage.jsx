import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ButtonCard from "../component/sharingComponents/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/validation/schemas";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoginError("");

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setLoginError(result.error || "Login failed. Please try again.");
      }
    } catch {
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className=" bg-linear-to-br from-green-50 via-blue-50 to-cyan-50 flex items-center justify-center  md:px-4 md:py-5">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-600 to-blue-600 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-slate-600">Login to your NearBuy account</p>
          </div>

          {loginError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  {...register("email", {
                    onChange: () => setLoginError(""),
                  })}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.email ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  {...register("password", {
                    onChange: () => setLoginError(""),
                  })}
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.password ? "border-red-500" : "border-slate-200"
                  }`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <ButtonCard
              label="Login"
              type="submit"
              loading={isSubmitting}
              loadingLabel="Logging in..."
              disabled={isSubmitting}
            />
          </form>

          <p className="text-center mt-6 text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
