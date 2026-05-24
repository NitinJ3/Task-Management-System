import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getProject, deleteProject } from '../api/project.api';

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState();
  const [searchParams] = useSearchParams();
  const past = searchParams.get('completed') === "true";
  const navigate = useNavigate();

  useEffect(() => {
    getProject(Number(id))
      .then((response) => {
        setProject(response.data.project);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const edit = (id) => navigate(`/head/projects/edit/${id}`);

  const destroy = (id) => {
    if (window.confirm("Delete project?")) {
      deleteProject(id)
        .then((response) => {
          alert(response.data.message);
          navigate("/head/projects");
        })
        .catch((error) => alert("Error deleting project"));
    }
  };

  const handleView = (id) => {
    past ? navigate(`/tasks/${id}/?completed=true`) : navigate(`/tasks/${id}`);
  };

  return (
    <div className="flex justify-center items-start pt-2 bg-gray-50  overflow-hidden">
      {project ? (
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
          {/* Compact Indigo Header */}
          <div className="bg-indigo-600 px-6 py-4 text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">Project Profile</p>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tight">{project.name}</h2>
              <span className="bg-cyan-400 text-cyan-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                {project.status || 'Active'}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-12">
            {/* Description Section - Fixed Height to prevent scrolling */}
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
              <div className="border-l-2 border-indigo-100 pl-3">
                <p className="text-slate-600 text-xs leading-snug line-clamp-2">
                  {project.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Department</p>
                  <p className="text-base font-black text-slate-800">{project.department || 'General'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Team Leader</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                      {project.user?.name?.charAt(0) || 'J'}
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      {project.user?.name ? project.user.name : "Not Assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Dates */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Start Date</span>
                  <span className="text-xs font-black text-slate-800">{project.start_date}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">End Date</span>
                  <span className="text-xs font-black text-red-400">{project.end_date}</span>
                </div>
              </div>
            </div>

            {/* Compact Footer Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleView(project.id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Manage Tasks
                </button>
                <button 
                  onClick={() => edit(project.id)}
                  className="bg-white text-slate-600 border border-gray-200 px-4 py-2 rounded-lg font-bold text-xs hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Edit Details
                </button>
              </div>
              <button 
                onClick={() => destroy(project.id)}
                className="text-red-500 font-bold text-xs hover:text-red-700 transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 font-medium py-10">Loading...</div>
      )}
    </div>
  );
};

export default ProjectView;