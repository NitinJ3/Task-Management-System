import React from "react";
import { useNavigate } from "react-router-dom";
const Welcome = () => {
  const navigate = useNavigate();
  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
    <div className="max-w-md w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        Task Management System
      </h1>
      
      <p className="text-lg text-gray-600">
        Organize your work and manage tasks effortlessly
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button 
          onClick={() => navigate("/signup")}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
        >
          Sign up
        </button>
        
        <button 
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg transition-all duration-200"
        >
          Log in
        </button>
      </div>
    </div>
  </div>
);
};

export default Welcome;
