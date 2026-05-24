import { get, set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React, { use, useState, useEffect } from "react";
import { createTask } from "../api/task.api";
import {  showProjects } from "../api/project.api";
import { useParams } from "react-router-dom";
import { updateTask } from "../api/task.api";
import { getTask } from "../api/task.api";
import { useUser } from "../context/UserContext";
import { getTeamLeaderProjects } from "../api/project.api";
import { getAsscociatedEmployees } from "../api/project.api";
import { useSearchParams } from "react-router-dom";   


const TaskCreate = () => {
  const [project, setProject] = useState();
  const [employee, setEmployee] = useState();
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const {user} = useUser();
  const [searchParams] = useSearchParams();
  const project_id = Number(searchParams.get('project_id'));
  console.log("page rendered");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    
    if(user?.role_id===1){
    showProjects()
      .then((res) => {
        setProject(res.data.projects.data);
        AssociatedEmployees(res.data.projects.data[0].id);
      })
      .catch((err) => {
        if(err.response.status == "404"){
          console.log(err.response.data.message);
          navigate("/tasks");
        }
        console.log(err);
      });

    }
    
    else if(user?.role_id===2){

      getTeamLeaderProjects()
      .then((response)=>{
        setProject(response.data.projects);
        AssociatedEmployees(response.data.projects[0].id);
      })
      .catch((error)=>{
        console.log(error);
      });
    }

      

    if (id) {
      setEdit(true);
      getTask(Number(id))
        .then((response) => {
          console.log(response.data.task);
          
          AssociatedEmployees(response.data.task.project_id).then(() => {
           reset(response.data.task);
         });

        })
        .catch((error) => {
          alert("Error fetching task details: " + error.response.data.message);
          navigate("/tasks");
        });
    }
  }, []);

  useEffect(() => {
    if(project_id){
      setValue("project_id", project_id);}
    },[project]);


  //this includes team leader and all employees of the department

    function AssociatedEmployees(id) {
      return getAsscociatedEmployees(id)
        .then((response) => {
          setEmployee(response.data.employees);
        })
        .catch((error) => {
          console.log(error);
        });
    }

  function onsubmit(data) {
    if (edit) {
      const trimmedData = {
        id: Number(id),
        project_id: data.project_id,
        title: data.title,
        description: data.description,
        assigned_to: data.assigned_to,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date,
      };
      updateTask(trimmedData)
        .then((response) => {
          console.log(response);
          alert(response.data.message);
          navigate("/tasks");
        })
        .catch((error) => {
          console.log(error);
          alert("Error updating task: " + error.response.data.message);
        });
    } else {
      const trimmedData = {
        project_id: data.project_id,
        title: data.title.trim(),
        description: data.description.trim(),
        assigned_to: data.assigned_to.trim(),
        status: data.status.trim(),
        priority: data.priority.trim(),
        due_date: data.due_date.trim(),
      };
      createTask(trimmedData)
        .then((response) => {
          console.log(response);
          alert(response.data.message);
          reset();
        })
        .catch((error) => {
          console.log(error);
          alert("Error creating task: " + error.response.data.message);
        });
    }
  }

  return (
  <div className="max-w-xl mx-auto my-6 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
    {/* Dynamic Header */}
    <div className={`px-8 py-5 border-b-4 ${edit ? 'border-amber-400 bg-amber-50' : 'border-indigo-500 bg-indigo-50'}`}>
      <h1 className="text-xl font-bold text-gray-800">
        {edit ? "Update Task" : "Create New Task"}
      </h1>
      <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mt-1">
        Assignment Details
      </p>
    </div>

    <form onSubmit={handleSubmit(onsubmit)} className="p-6 space-y-4">
      
      {/* Project Selection */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Select Project</label>
        <select 
          {...register("project_id", { required: "Project is required" })}
          onChange={(e) => AssociatedEmployees(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        >
          <option value="">Choose a project...</option>
          {project?.map((proj) => (
            <option key={proj.id} value={proj.id}>{proj.name}</option>
          ))}
        </select>
        {errors.project_id && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.project_id.message}</p>}
      </div>

      {/* Task Name */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Task Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          {...register("title", {
            required: "Task title is required",
            minLength: { value: 3, message: "Too short" },
          })}
        />
        {errors.title && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Task Description</label>
        <textarea
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          {...register("description", {
            required: "Task description is required",
            minLength: { value: 8, message: "Min 8 characters required" },
          })}
        />
        {errors.description && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.description.message}</p>}
      </div>

      {/* Two Column Grid: Employees & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Assign To</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            {...register("assigned_to", { required: "Assignee required" })}
          >
            <option value="">Select Member</option>
            {employee?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.role_id === 2 ? `${emp.name} (Lead)` : emp.name}
              </option>
            ))}
          </select>
          {errors.assigned_to && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.assigned_to.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            {...register("status", { required: "Status required" })}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Two Column Grid: Priority & Deadline */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Priority</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            {...register("priority", { required: "Priority required" })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Deadline</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            {...register("due_date", { required: "Deadline required" })}
          />
          {errors.due_date && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.due_date.message}</p>}
        </div>
      </div>

      {/* Submit Section */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button 
          type="submit"
          className={`px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg transition-all active:scale-95 ${
            edit ? "bg-amber-500 shadow-amber-100" : "bg-indigo-600 shadow-indigo-100"
          }`}
        >
          {edit ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  </div>
);
};

export default TaskCreate;
