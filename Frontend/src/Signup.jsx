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
    <div>
      <p>Create Account</p>

      <form onSubmit={handleSubmit(onSubmit)}>

        <label >
          Role:
          <select {...register('registered_role', { required: true })}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value={1}>
              Department Head
            </option>
            <option value={2}>
              Employee
            </option>
          </select>
        </label>

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


        {role == 1 &&

          <label>
            Department Name
            <input type="text"
              {...register('department', { required: true, minLength: { value: 2 } })}
            />
            {errors.department && <p>Department name is too short</p>}
          </label>


        }

        {
          role == 2 &&

          <label>
            Registration Code
            <input type="text"
              {...register('registration_code', { required: true, })}
            />
            {errors.registration_code && <p>Registration code is required</p>}
          </label>

        }

        <input type="submit"  
        value={isSubmitting ? "Registering" : "Sign up"}
          disabled={isSubmitting}/>

          
        <p>
          Already have an account <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
