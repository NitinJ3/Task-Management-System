import React from "react";
import { useEffect, useState } from "react";
import { get, set, useForm } from "react-hook-form";
import { getUserById } from "../api/user.api";
import { useParams } from "react-router-dom";
import { updateUser } from "../api/user.api";
import { deleteUser } from "../api/user.api";
import { useNavigate } from "react-router-dom";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getUserById(id)
      .then((response) => {
        console.log(response.data.user);
        reset(response.data.user);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }, []);

  function onSubmit(data) {
    const trimmedData = {
        id:id,
        name: data.name.trim(),
        email: data.email.trim(),
        is_active: data.is_active,
        role_id: data.role_id
    };

    updateUser(trimmedData)
    .then((response)=>{
        alert(response.data.message);
       
    })
    .catch((error)=>{
        alert(error.response.data.message);
    })

  }
  function handledeleteUser(id){
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    
    if (confirmDelete) {  
      deleteUser(id)
      .then((response)=>{
        alert(response.data.message);
        navigate("/head/users");
      })
      .catch((error)=>{
        alert(error.response.data.message);
      })
    }

  }

  return (
  <div className="max-w-xl mx-auto my-10 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
    {/* Dynamic Header for Edit Mode */}
    <div className="px-8 py-6 border-b-4 border-amber-400 bg-amber-50">
      <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
      <p className="text-sm text-gray-500 mt-1">
        Update professional details and system access for this employee.
      </p>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="employee@company.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            {...register("email", {
              required: { value: true, message: "Email is required" },
            })}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Status & Role Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Active Status</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
              {...register("is_active", {
                required: { value: "true", message: "Status is required" },
              })}
            >
              <option value={1}>Active</option>
              <option value={0}>Non Active</option>
            </select>
            {errors.is_active && <p className="mt-1 text-sm text-red-500">{errors.is_active.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">System Role</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
              {...register("role_id", {
                required: { value: "true", message: "Role is required" },
              })}
            >
              <option value={2}>Team Leader</option>
              <option value={3}>Employee</option>
            </select>
            {errors.role_id && <p className="mt-1 text-sm text-red-500">{errors.role_id.message}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
<div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

  <input 
    type="submit" 
    value="Update Employee Details" 
    className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 cursor-pointer transition-all active:scale-95 order-1 md:order-1"
  />

  <button 
    type="button"
    onClick={() => handledeleteUser(id)}
    className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest order-2 md:order-2"
  >
    Delete Employee
  </button>

</div>
    </form>
  </div>
);
};

export default UserEdit;
