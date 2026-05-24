import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTask, toggleStatus } from "./api/task.api";

const MyTaskView = () => {
  const [task, setTask] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTask(id)
      .then((response) => {
        setTask(response.data.task);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  // handle status update
  function handleStatusChange(status) {
    toggleStatus(id,  status )
      .then((response) => {
        alert(response.data.message);

        // update UI instantly
        setTask((prev) => ({
          ...prev,
          status: status,
        }));
      })
      .catch((error) => {
        console.log(error);
        alert("Error updating status");
      });
  }

  if (!task) return <p>Loading...</p>;

  return (
  <div className="flex justify-center items-start pt-4 bg-gray-50 h-[calc(100vh-80px)] overflow-hidden">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
      
      {/* Header Section */}
      <div className="bg-indigo-600 px-6 py-4 text-white">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Task Details</p>
        <h2 className="text-xl font-black tracking-tight leading-tight">{task.title}</h2>
      </div>

      <div className="p-6 space-y-5">
        {/* Description */}
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
          <p className="text-slate-600 text-xs leading-relaxed border-l-2 border-indigo-100 pl-3">
            {task.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{task.status}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Priority</p>
            <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{task.priority}</p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between bg-red-50/50 border border-red-100 rounded-xl px-4 py-3">
          <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Due Date</span>
          <span className="text-xs font-black text-red-600">{task.due_date}</span>
        </div>

        {/* Conditional Action Button */}
        <div className="pt-2">
          {task.status === "pending" && (
            <button
              onClick={() => handleStatusChange("active")}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Start Task
            </button>
          )}

          {task.status === "active" && (
            <button
              onClick={() => handleStatusChange("completed")}
              className="w-full bg-green-500 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95 transition-all"
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default MyTaskView;