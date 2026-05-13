import React, { useEffect, useState } from 'react'
import { resetPassword } from './api/user.api'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

  const [searchParams] = useSearchParams();
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const tokenFromUrl = searchParams.get("token");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if(password !== passwordConfirmation ){
      alert("Passwords do not match");
      return;
    }
    if(password.length < 6){    
        alert("Password must be at least 6 characters long");
        return;
    }


    resetPassword({
      email,
      token,
      password,
      password_confirmation: passwordConfirmation
    })
      .then((response) => {
        console.log(response.data.message);
        alert("Password reset successful");
        navigate("/login");
      })
      
      .catch((error) => {
        console.log(error);
        alert("Failed to reset password");
      });
  };

  return (
    <div>
        <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        <button type="submit">
          Reset Password
        </button>

      </form>
    </div>
  )
}

export default ResetPassword