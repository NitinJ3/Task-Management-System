import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser } from "../api/user.api";






//this route makes sure only Department Head and Team Leaders can acess 

const TaskRoute = () => {
    

    const [auth, setAuth] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();


    if(!token){
        navigate("/login");
    }
    useEffect(()=>{

        getUser()
        .then((response)=>{
            if(response.data.user.role_id===1 || response.data.user.role_id===2){
                setAuth(true);
               
            }
            else{
                navigate("/");
            }
        })
        .catch((error)=>{
             navigate("/login");
        })


    },[])




  return (
    <div>
      {auth?<Outlet/>:<div></div>}
    </div>
  )
}

export default TaskRoute
