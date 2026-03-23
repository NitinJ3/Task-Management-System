import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth.api';
import { useUser } from "../context/UserContext";
import { Outlet } from 'react-router-dom';

//this will be a common navbar for all users, currently its for department head

const Navbar = () => {

  const navigate = useNavigate();
  const {user} = useUser();

  function handleLogout() {
    logoutUser()
      .then((response) => {
        console.log(response.data.message); 
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        localStorage.removeItem("token");
        navigate("/");
      });
  }

  return (
    <div >
      <p>Task Management System</p>
      <p>{user?.department}</p>
      <p>{user?.name}</p>

      {/* head navbar */}

      {user && user.role_id==1 &&  (
      <> 
      <Link to="/head/dashboard">Dashboard</Link>
      <Link to="/head/projects">Projects</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/head/users">Employees</Link>
      </>
      )}

      {user && user.role_id==2 &&  (
      <> 
      <Link to="/lead/dashboard">Dashboard</Link>
      <Link to="/tasks">Tasks</Link>
      </>
      )}


      <button onClick={handleLogout}>Logout</button>
      <Outlet />
    </div>
  )
}

export default Navbar
