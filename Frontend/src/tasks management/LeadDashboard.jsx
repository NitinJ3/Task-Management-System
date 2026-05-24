import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getTeamLeaderProjects } from "../api/project.api";
import { getPersonalTaskStatistics } from "../api/task.api";

const LeadDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [projectCount,setProjectCount] = useState(0)
  const [taskstats,setTaskStats] = useState({
    total:0,
    unfinished : 0,
    completed : 0
  })

  useEffect(() => {
    
    if (user?.role_id == 1) {
      navigate("/head/dashboard");
    }

    getTeamLeaderProjects()
    .then((response)=>{
      setProjectCount(response.data.count)
    })
    .catch((error)=>{
      console.log(error);
    })

     getPersonalTaskStatistics()
    .then((response)=>{
      setTaskStats({
        total:response.data.total,
        unfinished:response.data.noncompleted,
        completed:response.data.completed
      })
    })
    .catch((error)=>{
      console.log(error);
    })

  }, [user]);

  return (
  <div className="space-y-10 animate-in fade-in duration-500">
    {/* Page Title */}
    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
      Team Lead Dashboard
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Active Projects Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
        
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
          Active Projects You're Leading
        </h3>
        
        <div className="flex items-baseline space-x-2">
          <p className="text-5xl font-black text-slate-800 leading-none">
            {projectCount}
          </p>
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
            Projects
          </span>
        </div>
      </div>

      {/* Personal Tasks Progress Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
        
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
          Personal Tasks Completed
        </h3>
        
        <div className="flex items-baseline space-x-2">
          <p className="text-5xl font-black text-slate-800 leading-none">
            {taskstats.completed}
          </p>
          <p className="text-2xl font-bold text-gray-300">
            / {taskstats.total}
          </p>
        </div>
        
        {/* Progress Bar Visual */}
        <div className="mt-6 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-1000 ease-out"
            style={{ width: `${(taskstats.completed / taskstats.total) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);
};

export default LeadDashboard;
