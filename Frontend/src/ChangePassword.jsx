import React from 'react'
import { useForm } from "react-hook-form";
import { updateOwnDetails } from './api/user.api';
import { useUser } from "./context/UserContext"

const ChangePassword = () => {

     const { user } = useUser();

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
        console.log(response.data);
    } catch (error) {
        console.error("Error updating details:");
        alert(error.response.data.message);
    }
}


  return (
    <div>
        <h1>Change Password</h1>
      <form onClick={handleSubmit(onSubmit)}> 

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

            <button disabled={isSubmitting}>Change Password</button>
      </form>
    </div>
  )
}

export default ChangePassword
