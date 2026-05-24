import React from 'react'
import { getTeamLeaderProjects } from './api/project.api'
import { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Leader_Projects = () => {

    const [projects,setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{

        getTeamLeaderProjects()
        .then((response)=>{
            setProjects(response.data.projects);
            console.log(response.data.projects);
        })
        .catch((error)=>{
            console.log(error);
        })

    },[])

    function viewTasks(id){
            navigate(`/tasks/${id}`);
    }

 return (
  <div className="space-y-8 animate-in fade-in duration-500">
    {/* Page Title & Subtitle */}
    <div className="border-b border-gray-100 pb-6">
      <h1 className="text-2xl font-black text-slate-800 tracking-tight">
        Team Leader Projects
      </h1>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
        Manage and monitor projects assigned to your leadership.
      </p>
    </div>

    <div className="space-y-6">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
        Project List
      </h2>

      {projects.length === 0 ? (
        <div className="py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
          <p className="font-medium text-sm">No Projects Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between h-full"
            >
              {/* Blue Status Header Section */}
              <div className="bg-indigo-600 px-5 py-2 flex items-center">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">
                  Status: {project.status || 'Active'}
                </span>
              </div>

              <div className="p-6 pt-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-8 leading-tight">
                  {project.name}
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Start Date</span>
                    <span className="text-slate-600 font-black">
                      {new Date(project.start_date + "T00:00:00").toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">End Date</span>
                    <span className="text-slate-600 font-black">
                      {new Date(project.end_date + "T00:00:00").toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => viewTasks(project.id)}
                  className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                >
                  View Tasks
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default Leader_Projects
