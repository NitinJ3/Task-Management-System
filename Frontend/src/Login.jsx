import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api/auth.api";
import { useUser } from "./context/UserContext";

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(data) {
    let trimmedData = {
      email: data.email.trim(),
      password: data.password.trim(),
    };

    return loginUser(trimmedData)
      .then((response) => {
        console.log(response.data.message);
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        if (response.data.user.role_id === 1) {
          navigate("/head/dashboard");
        } else if (response.data.user.role_id === 2) {
          navigate("/lead/dashboard");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      
      <p className="text-2xl font-bold text-center text-gray-800 mb-6">
        Log In
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
       <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      {...register("password", {
        required: true,
      })}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>

  {errors.password && (
    <p className="text-red-500 text-sm mt-1">
      {errors.password.message}
    </p>
  )}
</div>

        {/* Submit */}
        <input
          type="submit"
          value={isSubmitting ? "Logging in..." : "Login"}
          disabled={isSubmitting}
          className={`w-full py-2 rounded-lg font-medium text-white transition ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        />

        {/* Signup Redirect */}
        <p className="text-sm text-center text-gray-600">
          Dont have an account{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>

      {/* Global Error */}
      {error && (
        <p className="text-red-500 text-sm text-center mt-4">
          {error}
        </p>
      )}

    </div>
  </div>
);
};

export default Login;
