import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser } from "../api/user.api";



const HeadRoute = () => {

  
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);

     

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

    getUser()
      .then((response) => {
        console.log(response.data.user);
        if (!(response.data.user.role_id === 1)) {
          navigate("/");
        } else {
          setAuth(true);
        }

       
      })
      .catch((error) => {
        console.log(error);
        navigate("/login");
      });
  }, []);

  return (
    <>
      {auth && <Outlet />}
      {/* outlet is used to allow child elements to be rendered inside this component */}
    </>
  );
};

export default HeadRoute;
