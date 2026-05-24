import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { logoutUser } from '../api/auth.api';
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  function handleLogout() {
    logoutUser()
      .then(() => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Container */}
      <nav className="bg-slate-900 text-white h-16 px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        
        {/* Left Section: Logo & User Info */}
        <div className="flex items-center space-x-8">
          <div className="leading-tight">
            <h1 className="text-indigo-400 font-black text-xl tracking-tighter">TASK</h1>
            <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400 font-bold">Management System</p>
          </div>

          <div className="hidden md:block border-l border-slate-700 pl-6">
            <p className="text-sm font-bold text-slate-100 leading-none">{user?.name}</p>
            <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">{user?.department}</p>
          </div>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium text-slate-300">
          {user && user.role_id === 1 && (
            <>
              <Link to="/head/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link to="/head/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link to="/tasks" className="hover:text-white transition-colors">Tasks</Link>
              <Link to="/head/users" className="hover:text-white transition-colors">Employees</Link>
              <Link to="/leaves" className="hover:text-white transition-colors">Leaves</Link>
            </>
          )}

          {user && user.role_id === 2 && (
            <>
              <Link to="/lead/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link to="/lead/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link to="/tasks" className="hover:text-white transition-colors">Tasks</Link>
              <Link to="/mytasks" className="hover:text-white transition-colors">My Tasks</Link>
              <Link to="/leaves" className="hover:text-white transition-colors">Leaves</Link>
            </>
          )}

          {user && user.role_id === 3 && (
            <>
              <Link to="/UserDashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link to="/UserProjects" className="hover:text-white transition-colors">Projects</Link>
              <Link to="/mytasks" className="hover:text-white transition-colors">My Tasks</Link>
              <Link to="/leaves" className="hover:text-white transition-colors">Leaves</Link>
            </>
          )}
          
          {user && <Link to="/myaccount" className="hover:text-white transition-colors">My Account</Link>}
        </div>

        {/* Right Section: Logout Button */}
        <div>
          <button 
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-4 rounded border border-slate-700 transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Navbar;