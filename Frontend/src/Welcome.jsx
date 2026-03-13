import React from "react";
import { useNavigate } from "react-router-dom";
const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Task Management System</h1>
      <p>Organize your work and manage tasks effortlessly</p>
      <button onClick={() => navigate("/signup")}>Sign up</button>
      <button onClick={() => navigate("/login")}>Log in</button>
    </div>
  );
};

export default Welcome;
