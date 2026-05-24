import React, { useEffect } from 'react'
import { useState } from 'react'
import { useUser } from "./context/UserContext"
import { useForm } from "react-hook-form";
import { updateOwnDetails } from './api/user.api';
import { useNavigate } from 'react-router-dom';

const MyDetail = () => {

    const { user ,setUser } = useUser();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        console.log(user);
        if (user) {
            reset(user);
        }

    }, [user])

    function onSubmit(data) {
        const trimmedData =
        {   
            id: user.id,
            name: data.name,
            email: data.email,
            password:false
        };

        return updateOwnDetails(trimmedData)
            .then((response) => {
                console.log(response.data);
                alert("Details updated successfully");
                setUser({...user,name:trimmedData.name,email:trimmedData.email}); 
                console.log(user);
            })
            .catch((error) => {
                console.error("Error updating details:",);
                alert(error.response.data.message);
            });

    }

    return (
  <div className="max-w-xl mx-auto my-10 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
    {/* Page Header */}
    <div className="px-8 py-6 border-b-4 border-indigo-500 bg-indigo-50">
      <h1 className="text-2xl font-bold text-gray-800">Your Account Details</h1>
      <p className="text-sm text-gray-500 mt-1">
        Manage your personal profile and account settings.
      </p>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        
        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Name</label>
          <input
            type="text"
            placeholder="Your Name"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
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
          />
          {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            {...register("email", {
              required: { value: true, message: "Email is required" },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
        </div>

        {/* Department (Disabled) */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Department</label>
          <input 
            type="text" 
            disabled 
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
            {...register("department")} 
          />
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <button 
          type="button"
          onClick={() => navigate('/change-password')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
        >
          Change Password
        </button>

        <button 
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Details"}
        </button>
      </div>
    </form>
  </div>
);
}

export default MyDetail
