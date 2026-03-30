import React, { useEffect ,useState} from 'react'
import { useParams } from "react-router-dom";
import { getProject } from '../api/project.api';
import { useNavigate } from 'react-router-dom';
import { deleteProject } from '../api/project.api';

const ProjectView = () => {
 const {id} = useParams();
 const [project,setProject] = useState(); 

const navigate = useNavigate();

useEffect(()=>{

    getProject(Number(id))
    .then((response)=>{
        console.log(response.data.project);
        setProject(response.data.project);
    })
    .catch((error)=>{
        if(error.response.status=="404"){
            console.log(error.response.data.message);
        }
        else{
            console.log(error);
        }
    });


},[]);


 function edit(id){

   navigate(`/head/projects/edit/${id}`);
  
}

    function destroy(id){

    deleteProject(id)
    .then((response)=>{
        console.log(response.data.message);
        alert(response.data.message);
        navigate("/head/projects");
    })
    .catch((error)=>{
        console.log(error);
        alert("Error deleting project: " + error.response.data.message);
    })   

    }


 return (
  project ? (
    <div className=" bg-slate-50/50 p-8 text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-8 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Project Overview
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {project.name}
            </h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              {project.department}
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => navigate(`/tasks/${project.id}`)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              Tasks
            </button>
            <button
              onClick={() => edit(project.id)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Edit
            </button>
            <button
              onClick={() => destroy(project.id)}
              className="px-5 py-2.5 bg-rose-50 text-rose-600 font-semibold rounded-lg border border-rose-100 hover:bg-rose-100 transition-all active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Description
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {project.description}
              </p>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
                Project Metadata
              </h2>
              
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Team Leader</span>
                  <span className="text-slate-800 font-medium">{project.user.name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Start</span>
                    <span className="text-slate-700">{project.start_date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400 uppercase">End</span>
                    <span className="text-slate-700">{project.end_date}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-500">Current Status</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-md ${
                      project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      project.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 animate-pulse" />
      <h3 className="text-xl font-bold text-slate-800">No project found</h3>
      <p className="text-slate-500 max-w-xs">We couldn't find the project you're looking for. Please check the URL or your dashboard.</p>
    </div>
  )
);
}

export default ProjectView
