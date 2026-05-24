import React from 'react'
import { useEffect , useState } from 'react';
import { getCompletedTasks } from './api/task.api';
import { getProjectsByEmployee } from './api/project.api';
import { useNavigate } from 'react-router-dom';


const MyCompletedTasks = () => {
    const [projects, setProjects] = useState([]);
        const [tasks,setTasks] = useState([]);
        const navigate = useNavigate();
     
    function fetchTasks(id){
        getCompletedTasks(id)
        .then((response)=>{
            setTasks(response.data.completed);
        })
        .catch((error)=>{
            console.log(error);
        })
    }




      useEffect(()=>{
      
              getProjectsByEmployee()
              .then((response)=>{
                  setProjects(response.data.projects);
                  fetchTasks(response.data.projects[0].id);
              })
              .catch((error)=>{
                  console.log(error);
              })
      
          },[])  

          function handleView(id){
            navigate(`/mytasks/task/${id}`);
          }
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {projects.length == 0 ? (
        <div className="py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
          <p className="text-sm font-medium text-gray-400">No Projects Found</p>
        </div>
      ) : (
        <>
          {/* Action Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">My Completed Tasks</h1>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">Archive View</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Project:</span>
              <select
                defaultValue={projects[0]?.id}
                onChange={(e) => fetchTasks(e.target.value)}
                className="bg-white border-2 border-green-500 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {tasks.length == 0 ? (
              <p className="col-span-full text-[11px] text-gray-400 font-bold uppercase tracking-widest text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No completed tasks found in this project
              </p>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{task.title}</p>
                      <p className="text-[9px] font-black text-indigo-500 uppercase mt-1">
                        {task.status == "pending" ? "New" : ""}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleView(task.id)}
                      className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      View
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-0.5 pt-2 border-t border-gray-50">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Completed On</span>
                    <span className="text-[10px] font-black text-slate-600">{task.due_date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MyCompletedTasks
