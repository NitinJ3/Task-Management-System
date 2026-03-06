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

  function onSubmit(data) {
    let trimmedData = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    };

    //register user
    registerUser(trimmedData)
      .then((response) => {
        console.log(response.data.message);
        alert("Registration succesfull");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          alert(error.response.data.errors);
        } else {
          console.log(error);
        }
      });
  }

  return (
    <div>
      <p>Create Account</p>
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
              required: { value: true, message: "Email is required" }
            })}
          />
        </label>
        {errors.email && <p>{errors.email.message}</p>}
        <label>
          Password
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
        </label>
        {errors.password && <p>{errors.password.message}</p>}
        <input type="submit" value={"Sign Up"}/>
        <p>
          Already have an account <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
