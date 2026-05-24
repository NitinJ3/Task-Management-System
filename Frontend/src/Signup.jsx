import React from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "./api/auth.api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors , isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    //department head registration
    if (role == 1) {
      let trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        department: data.department.trim(),
        registered_role : data.registered_role,
      };

      //register user
      try {
        const response = await registerUser(trimmedData);
        console.log(response.data.message);
        alert("Registration succesfull");
        navigate("/login");
      } catch (error) {

        if(error.response?.status==422){
          alert(error.response.data.erros);
        }
        else{
          alert(error.response.data.message);
          console.log(error);
        }
        }
      }
    

    //employee registration

    if (role == 2) {
      let trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        registration_code: data.registration_code.trim(),
        registered_role : data.registered_role,
      };

      try {
        const response = await registerUser(trimmedData);
        console.log(response.data.message);
        alert("Registration succesfull");
        navigate("/login");
      } catch (error) {
        
          if(error.response?.status==422){
          alert(error.response.data.erros);
        }
        else{
          alert(error.response.data.message);
          console.log(error);
        }
      }
    }

  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Role:</label>
            <select
              {...register("registered_role", { required: true })}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value={1}>Department Head</option>
              <option value={2}>Employee</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Name:</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500"
              {...register("name", { required: true, minLength: 3 })}
            />
            {errors.name && <p className="text-[10px] text-red-500 mt-1">Invalid name</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500"
              {...register("email", { required: true })}
            />
          </div>

          {/* Password */}
<div>
  <label className="block text-xs font-semibold text-gray-600 mb-1">
    Password
  </label>

  <input
    type="password"
    className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500"
    {...register("password", {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
        message: "Password must contain uppercase and lowercase letters"
      }
    })}
  />

  {errors.password && (
    <p className="text-red-500 text-xs mt-1">
      {errors.password.message}
    </p>
  )}
</div>

          {/* Conditional Blue Box Section */}
          {(role == 1 || role == 2) && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 transition-all">
              {role == 1 ? (
                <>
                  <label className="block text-xs font-semibold text-indigo-900 mb-1 text-left">Department Name:</label>
                  <input
                    type="text"
                    className="w-full border border-indigo-400 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    {...register("department", { required: true })}
                  />
                </>
              ) : (
                <>
                  <label className="block text-xs font-semibold text-indigo-900 mb-1 text-left">Registration Code:</label>
                  <input
                    type="text"
                    className="w-full border border-indigo-400 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    {...register("registration_code", { required: true })}
                  />
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-md hover:bg-indigo-700 transition-colors shadow-md active:scale-[0.98] mt-2"
          >
            {isSubmitting ? "Registering..." : "Sign up"}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
