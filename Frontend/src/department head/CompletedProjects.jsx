import React from 'react'
import { useState, useEffect } from 'react'
import { getPrevious } from '../api/project.api'
import { useNavigate } from 'react-router-dom'

const CompletedProjects = () => {

    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        getPrevious()
            .then((response) => {
                setProjects(response.data.projects);
            })
            .catch((error) => {
                if (error.response.status == "404") {
                    alert("No Projects Found");
                }
                else {
                    console.log(error);
                }
            });


    }, []);

    function handleView(id) {
        navigate(`/head/projects/view/${id}/?completed=true`);
    }



    return (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-black text-slate-800 tracking-tight">Completed Projects</h1>
      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
        Archive
      </span>
    </div>

    {projects.length === 0 ? (
      <div className="py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
        <p className="font-medium">No completed projects found</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{project.name}</h3>
                <div className="bg-green-50 text-green-600 p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Started</span>
                  <span className="text-sm font-semibold text-slate-600">
                    {new Date(project.start_date + "T00:00:00").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Finished</span>
                  <span className="text-sm font-semibold text-slate-600">
                    {new Date(project.end_date + "T00:00:00").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleView(project.id)}
              className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
            >
              View Archive Details
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default CompletedProjects
