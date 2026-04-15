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
    <div>
      <h1>Employee Details</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name:
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
          />
        </label>
        {errors.name && <p>{errors.name.message}</p>}
        <label>
          Email
          <input
            type="email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
            })}
          />
        </label>
        {errors.email && <p>{errors.email.message}</p>}

        <label>
          Active Status
          <select
            {...register("is_active", {
              required: { value: "true", message: "Status is required" },
            })}
          >
            <option value={1}>Active</option>
            <option value={0}>Non Active</option>
          </select>
          {errors.is_active && <p>{errors.is_active.message}</p>}
        </label>
        <label>
            Role
            <select
              {...register("role_id", {
                required: { value: "true", message: "Role is required" },
              })}
            >
              <option value={2}>Team Leader</option>
              <option value={3}>Employee</option>
                {errors.role_id && <p>{errors.role_id.message}</p>}
            </select>
            {errors.role_id && <p>{errors.role_id.message}</p>}
        </label>

        <input type="submit" value={"Update Employee Details"} />

      </form>

      <br />
      <button onClick={()=>handledeleteUser(id)}>Delete Employee</button>


    </div>
  );
};

export default UserEdit;
