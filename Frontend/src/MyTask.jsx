import React from 'react'
import { useEffect , useState } from 'react';
import { toDoTasks } from './api/task.api';
import { getProjectsByEmployee } from './api/project.api';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const MyTask = () => {

    const [projects, setProjects] = useState([]);
    const [low,setLow] = useState([]);
    const [medium,setMedium] = useState([]);
    const [high,setHigh] = useState([]);
    const navigate = useNavigate();
    const [searchParams]  = useSearchParams();
    const project_id = searchParams.get('id');
    

    function fetchTasks(id){
             toDoTasks(id)
        .then((response)=>{
            setLow(response.data.low);
            setMedium(response.data.medium);
            setHigh(response.data.high);
        })
        .catch((error)=>{
            console.log(error);
        })

    }


    useEffect(()=>{

        getProjectsByEmployee()
        .then((response)=>{
            setProjects(response.data.projects);
            if(project_id){
              fetchTasks(project_id);
            }
            else{
            fetchTasks(response.data.projects[0].id);
          }
            console.log(response.data.projects);
        })
        .catch((error)=>{
            console.log(error);
        })

    },[])

    function handleView(id){
        navigate(`/mytasks/task/${id}`);
    }

return (
  <div className="space-y-4 max-w-7xl mx-auto">
    {projects.length === 0 ? (
      <p className="text-center text-gray-400 py-10">No tasks available</p>
    ) : (
      <>
        {/* Compact Action Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-800">My Tasks</h1>
            <select
              defaultValue={project_id ? project_id : projects[0]?.id}
              onChange={(e) => fetchTasks(e.target.value)}
              className="bg-white border-2 border-indigo-500 rounded-lg px-3 py-1 text-xs font-bold outline-none"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => navigate("/completed/tasks")}
            className="text-[10px] font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            View Completed Tasks
          </button>
        </div>

        {/* Priority Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Low Priority */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Low
            </h2>
            {low.length > 0 ? (
              low.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{task.title}</p>
                    <button onClick={() => handleView(task.id)} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">View</button>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold">{task.due_date}</p>
                    <p className="text-[9px] font-black text-indigo-500 uppercase">{task.status === "pending" ? "New" : ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-gray-400 italic px-1">No low priority tasks</p>
            )}
          </div>

          {/* Medium Priority */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Medium
            </h2>
            {medium.length > 0 ? (
              medium.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-amber-400 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{task.title}</p>
                    <button onClick={() => handleView(task.id)} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">View</button>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold">{task.due_date}</p>
                    <p className="text-[9px] font-black text-indigo-500 uppercase">{task.status === "pending" ? "New" : ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-gray-400 italic px-1">No medium priority tasks</p>
            )}
          </div>

          {/* High Priority */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> High
            </h2>
            {high.length > 0 ? (
              high.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{task.title}</p>
                    <button onClick={() => handleView(task.id)} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">View</button>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold">{task.due_date}</p>
                    <p className="text-[9px] font-black text-indigo-500 uppercase">{task.status === "pending" ? "New" : ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-gray-400 italic px-1">No high priority tasks</p>
            )}
          </div>

        </div>
      </>
    )}
  </div>
);
}

export default MyTask
