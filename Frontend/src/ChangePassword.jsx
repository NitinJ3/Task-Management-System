import React from 'react'
import { useForm } from "react-hook-form";
import { updateOwnDetails } from './api/user.api';
import { useUser } from "./context/UserContext"
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {

     const { user } = useUser();
      const navigate = useNavigate();

     const {
            register,
            handleSubmit,
            watch,
            reset,
            formState: { errors, isSubmitting },
        } = useForm();

async function onSubmit(data) {
    
    const trimmedData = {
        id: user.id,
        password: data.password.trim(),
    }

    try {
        const response = await updateOwnDetails(trimmedData);
        alert(response.data.message);
        navigate('/myaccount'); 
    } catch (error) {
        console.error("Error updating details:");
        alert(error.response.data.message);
    }
}


 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

    <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm border border-gray-100">

      <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Change Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>

          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Change Password
        </button>

      </form>
    </div>

  </div>
);
}

export default ChangePassword
