import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./api/auth.api";
import { useUser } from "./context/UserContext";
import { forgotPassword } from "./api/user.api";

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [resetPassword, setResetPassword] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(data) {
    let trimmedData = {
      email: data.email.trim(),
      password: data.password.trim(),
    };

    return loginUser(trimmedData)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        if (response.data.user.role_id === 1) {
          navigate("/head/dashboard");
        } else if (response.data.user.role_id === 2) {
          navigate("/lead/dashboard");
        } else {
          navigate("/UserDashboard");
        }
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  }

  function handleResetPassword(e) {
    e.preventDefault();
    forgotPassword(email)
      .then((response) => {
        alert("Password reset link sent to your email");
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-sm p-8">
        {!resetPassword ? (
          <>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
              Log In
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500 ${errors.email ? "border-red-500" : ""
                    }`}
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetPassword(true)}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline"
                  >
                    Reset Password?
                  </button>
                </div>
                <input
                  type="password"
                  className={`w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500 ${errors.password ? "border-red-500" : ""
                    }`}
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-md hover:bg-indigo-700 transition-colors shadow-md active:scale-[0.98] mt-2 disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2 rounded text-center">
                  {error}
                </div>
              )}

              <p className="text-center text-xs text-gray-500 mt-4">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Sign up
                </a>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
              Reset Password
            </h2>
            <form className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 transition-all">
                <label className="block text-xs font-semibold text-indigo-900 mb-1">
                  Enter Email:
                </label>
                <input
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full border border-indigo-400 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                onClick={(e) => handleResetPassword(e)}
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-md hover:bg-indigo-700 transition-colors shadow-md active:scale-[0.98]"
              >
                Send Link
              </button>
              <button
                type="button"
                onClick={() => setResetPassword(false)}
                className="w-full text-xs text-gray-500 font-semibold hover:text-gray-700 transition-colors"
              >
                Back to Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;