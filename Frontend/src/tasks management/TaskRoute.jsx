import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser } from "../api/user.api";
import { useUser } from "../context/UserContext";

//this route makes sure only Department Head and Team Leaders can acess

const TaskRoute = () => {
  const [auth, setAuth] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
  
     const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  
    if (user) {
      if (user.role_id === 1 || user.role_id === 2) {
        setAuth(true);
      } else {
        navigate("/");
      }
    }
  }, [user]);

  return <div>{auth ? <Outlet /> : <div></div>}</div>;
};

export default TaskRoute;
