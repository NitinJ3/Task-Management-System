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
  <div className="min-h-screen bg-gray-100">
    
    {/* Navbar */}
    <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      
      {/* Left Section */}
      <div>
        <p className="text-xl font-bold text-gray-800">
          Task Management System
        </p>
        <p className="text-sm text-gray-500">
          {user?.department}
        </p>
      </div>

      {/* Center Links */}
      <div className="flex gap-6 text-gray-700 font-medium">
        
        {user && user.role_id == 1 && (
          <>
            <Link to="/head/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/head/projects" className="hover:text-blue-600">
              Projects
            </Link>
            <Link to="/tasks" className="hover:text-blue-600">
              Tasks
            </Link>
            <Link to="/head/users" className="hover:text-blue-600">
              Employees
            </Link>
          </>
        )}

        {user && user.role_id == 2 && (
          <>
            <Link to="/lead/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/tasks" className="hover:text-blue-600">
              Tasks
            </Link>
          </>
        )}

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700 font-medium">
          {user?.name}
        </p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

    </div>

    {/* Page Content */}
    <div className="p-6">
      <Outlet />
    </div>

  </div>
);
}

export default Navbar
