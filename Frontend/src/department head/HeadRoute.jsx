import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser } from "../api/user.api";
import { useUser } from "../context/UserContext";


const HeadRoute = () => {

  
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const {user} = useUser();
     

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
    if (user) {
      if (user.role_id === 1) {
        setAuth(true);
        console.log(user);
      } else {
        navigate("/");
      }
    }
  }, [user]);

  return (
    <>
      {auth && <Outlet />}
      {/* outlet is used to allow child elements to be rendered inside this component */}
    </>
  );
};

export default HeadRoute;
