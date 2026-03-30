import React from "react";
import { useEffect, useState } from "react";
import { getDepartmentEmployees } from "../api/user.api";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();  


  useEffect(() => {
    getDepartmentEmployees()
      .then((response) => {
        setUsers(response.data.employees);
        console.log(response.data.employees);
      })
      .catch((error) => {
        if (error.response.data.status == "404") {
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      });
  }, []);

return (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    {/* Header */}
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <h2 className="text-lg font-bold text-slate-800">Department Employees</h2>
    </div>

    {/* Table Container */}
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
            <th className="px-6 py-3 border-b border-slate-200">Name</th>
            <th className="px-6 py-3 border-b border-slate-200">Email</th>
            <th className="px-6 py-3 border-b border-slate-200 text-center">Status</th>
            <th className="px-6 py-3 border-b border-slate-200">Role</th>
            <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
              <td className="px-6 py-4 text-sm text-center">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  user.is_active == 1 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                  {user.is_active == 1 ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{user.role.name}</td>
              <td className="px-6 py-4 text-sm text-right">
                <button 
                  onClick={() => navigate(`/head/users/edit/${user.id}`)}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors underline-offset-4 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default UserList;
