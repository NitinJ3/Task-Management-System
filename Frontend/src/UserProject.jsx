import React, { useEffect, useState } from 'react';
import { getProjectsByEmployee } from './api/project.api';
import { useNavigate } from 'react-router-dom';


const UserProject = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProjectsByEmployee()
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleTasks(id) {
    navigate(`/mytasks?id=${id}`);

  }


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Projects</h1>
        <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          Assigned
        </span>
      </div>

      <div className="space-y-6">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Indigo Status Header Section */}
                <div className="bg-indigo-600 px-5 py-2 flex items-center">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">
                    Status: {project.status}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 leading-tight">
                    {project.name}
                  </h3>

                  <div className="space-y-3 mb-8">
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
                    onClick={() => handleTasks(project.id)}
                    className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                  >
                    View Tasks
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <p className="font-medium text-sm">No Projects Available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProject;