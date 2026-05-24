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
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

    <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm border border-gray-100">

      <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Reset Password
        </button>

      </form>

    </div>

  </div>
);
}

export default ResetPassword