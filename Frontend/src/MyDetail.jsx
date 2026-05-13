import React, { useEffect } from 'react'
import { useState } from 'react'
import { useUser } from "./context/UserContext"
import { useForm } from "react-hook-form";
import { updateOwnDetails } from './api/user.api';
import { useNavigate } from 'react-router-dom';

const MyDetail = () => {

    const { user } = useUser();
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
            })
            .catch((error) => {
                console.error("Error updating details:",);
                alert(error.response.data.message);
            });

    }

    return (
        <div>

            <h1>Your Account Details</h1>
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
                    <br />
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
                <br />

                {errors.password && <p>{errors.password.message}</p>}
                <label>
                    Department
                    <input type="text" disabled  {...register("department")} />
                </label>
                <button disabled={isSubmitting}>Update Details</button>
            </form>

            <button onClick={()=>navigate('/change-password')}>Change Password</button>
        </div>
    )
}

export default MyDetail
