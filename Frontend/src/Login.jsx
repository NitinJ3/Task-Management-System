import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api/auth.api";
import { useUser } from "./context/UserContext";

const Login = () => {
    const [error,setError] = useState(null);
    const navigate = useNavigate();
    const {user,setUser} = useUser();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
      } = useForm();
    
   function onSubmit(data){
    let trimmedData = {
        email: data.email.trim(),
        password: data.password.trim(),
    };

    loginUser(trimmedData)
    .then((response)=>{
        console.log(response.data.message);
        localStorage.setItem("token",response.data.token);
        setUser(response.data.user);
                if(response.data.user.role_id === 1){
                navigate("/head/dashboard");
                }else{
                    navigate("/");
                }
    })
    .catch((error)=>{
        console.log(error);
        setError(error.response.data.message);
    })

   }

  return (
    <div>
      <p>Log In</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email
          <input type="email" {...register("email", { required: true })} />
        </label>
        {errors.email && <p>{errors.email.message}</p>}
        <label>
          Password
          <input
            type="password"
            {...register("password", {
              required: true,
            })}
          />
        </label>
        {errors.password && <p>{errors.password.message}</p>}
        <input type="submit" value={"Login"}/>
        <p>Dont have an account <a href="/signup">Sign up</a></p>
      </form>
        {error && <p>{error}</p>}

    </div>
  )
}

export default Login
