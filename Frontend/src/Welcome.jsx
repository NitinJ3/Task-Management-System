import React from "react";
import { useNavigate } from "react-router-dom";
const Welcome = () => {
  const navigate = useNavigate();
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-3">
        Task Management System
      </h1>

      <p className="text-gray-600 mb-6">
        Organize your work and manage tasks effortlessly
      </p>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate("/signup")}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Sign up
        </button>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Log in
        </button>
      </div>

    </div>
  </div>
);
};

export default Welcome;
