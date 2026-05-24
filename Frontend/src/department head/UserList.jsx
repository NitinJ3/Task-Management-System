import React from "react";
import { useEffect, useState } from "react";
import { getDepartmentEmployees } from "../api/user.api";
import { useNavigate } from "react-router-dom";
import { createCode } from "../api/user.api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");

  const [current_page, setCurrentPage] = useState();
  const [last_page, setLastPage] = useState();
  const [pages, setPages] = useState();

  function generatePages(cp, lp) {
    let new_obj = { p1: 0, p2: 0, p3: 0 };

    if (lp >= 3) {
      if (cp == 1) {
        new_obj.p1 = cp;
        new_obj.p2 = cp + 1;
        new_obj.p3 = cp + 2;
      } else if (cp > 1 && cp < lp) {
        new_obj.p1 = cp - 1;
        new_obj.p2 = cp;
        new_obj.p3 = cp + 1;
      } else if (cp == lp) {
        new_obj.p1 = cp - 2;
        new_obj.p2 = cp - 1;
        new_obj.p3 = cp;
      }
    } else {
      for (let i = 1; i <= lp; i++) {
        new_obj[`p${i}`] = i;
      }
    }

    return new_obj;
  }

  function fetchUsers(page = 1, searchValue = search) {
    getDepartmentEmployees(page, searchValue)
      .then((response) => {

        setUsers(response.data.employees.data);

        setCurrentPage(response.data.employees.current_page);

        setLastPage(response.data.employees.last_page);

        let cp = response.data.employees.current_page;
        let lp = response.data.employees.last_page;

        setPages(generatePages(cp, lp));

        console.log(response.data.employees);

      })
      .catch((error) => {
        if (error.response?.status == "404") {
          setUsers([]);
        } else {
          alert(error);
        }
      });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function createUser() {
    createCode()
      .then((response) => {
        const code = response.data.code;
        setCode(code);
        console.log(code);
      })
      .catch((error) => {
        alert(error);
      });
  }

  function handleNext() {
    fetchUsers(current_page + 1);
  }

  function handlePrev() {
    fetchUsers(current_page - 1);
  }

  return (
  <div className="space-y-6">
    {/* Page Header and Search Action Bar */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">Department Employees</h2>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
            onChange={(e) => {
              setSearch(e.target.value);
              fetchUsers(1, e.target.value);
            }}
          />
        </div>
        <button 
          onClick={createUser}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          + Create User
        </button>
      </div>
    </div>

    {/* Registration Code Banner */}
    {code && (
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center space-x-3">
          <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Registration Code:</span>
          <span className="bg-white px-3 py-1 rounded-lg border border-indigo-200 font-black text-indigo-700 font-mono select-all">
            {code}
          </span>
        </div>
        <p className="text-xs text-indigo-400 font-medium italic">Share this code with employees for registration.</p>
      </div>
    )}

    {/* Modern Borderless Table */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-slate-800">{user.name}</p>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  user.is_active == 1 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-600"
                }`}>
                  {user.is_active == 1 ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                {user.role.name}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => navigate(`/head/users/edit/${user.id}`)}
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination Controls */}
    <div className="flex justify-center space-x-2 mt-10">
      <button
        disabled={current_page === 1}
        onClick={handlePrev}
        className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        &larr;
      </button>

      {pages != null &&
        Object.values(pages).map(
          (p) =>
            p != 0 && (
              <button
                key={p}
                onClick={() => fetchUsers(p)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                  current_page === p
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-slate-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
        )}

      <button
        disabled={current_page === last_page}
        onClick={handleNext}
        className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        &rarr;
      </button>
    </div>
  </div>
);
};

export default UserList;