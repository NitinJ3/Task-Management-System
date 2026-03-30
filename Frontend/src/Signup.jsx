import React from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "./api/auth.api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    let trimmedData = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    };

    //register user
    try {
      const response = await registerUser(trimmedData);
      console.log(response.data.message);
      alert("Registration succesfull");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 422) {
        alert(error.response.data.errors);
      } else {
        console.log(error);
      }
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      
      <p className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create Account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name:
          </label>
          <input
            type="text"
            {...register("name", {
              required: true,
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long",
              },
              pattern: {
                value: /^[A-Za-z ]+$/,
                message: "Name must contain only letters",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
            })}
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
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <input
          type="submit"
          value={"Sign Up"}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
        />

        {/* Login Redirect */}
        <p className="text-sm text-center text-gray-600">
          Already have an account{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>

      </form>
    </div>
  </div>
);
};

export default Signup;
