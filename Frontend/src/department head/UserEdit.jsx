import React from "react";
import { useEffect, useState } from "react";
import { get, set, useForm } from "react-hook-form";
import { getUserById } from "../api/user.api";
import { useParams } from "react-router-dom";
import { updateUser } from "../api/user.api";

const UserEdit = () => {
  const { id } = useParams();

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

return (
  <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-800">Employee Details</h1>
      <p className="text-slate-500 text-sm">Update the professional profile and status of this user.</p>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* Name Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className={`w-full px-4 py-2.5 rounded-lg border bg-white transition-all outline-none focus:ring-2 ${
            errors.name ? "border-rose-400 focus:ring-rose-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 3, message: "Name must be at least 3 characters" },
            pattern: { value: /^[A-Za-z ]+$/, message: "Only letters allowed" },
          })}
        />
        {errors.name && <span className="text-xs font-medium text-rose-500 italic">{errors.name.message}</span>}
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Email Address</label>
        <input
          type="email"
          placeholder="email@example.com"
          className={`w-full px-4 py-2.5 rounded-lg border bg-white transition-all outline-none focus:ring-2 ${
            errors.email ? "border-rose-400 focus:ring-rose-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span className="text-xs font-medium text-rose-500 italic">{errors.email.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Active Status</label>
          <select
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
            {...register("is_active", { required: "Status is required" })}
          >
            <option value={1}>Active</option>
            <option value={0}>Non Active</option>
          </select>
          {errors.is_active && <span className="text-xs font-medium text-rose-500">{errors.is_active.message}</span>}
        </div>

        {/* Role Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Role</label>
          <select
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
            {...register("role_id", { required: "Role is required" })}
          >
            <option value={2}>Team Leader</option>
            <option value={3}>Employee</option>
          </select>
          {errors.role_id && <span className="text-xs font-medium text-rose-500">{errors.role_id.message}</span>}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 active:scale-[0.98]"
        >
          Update Employee Details
        </button>
      </div>
    </form>
  </div>
);
};

export default UserEdit;
