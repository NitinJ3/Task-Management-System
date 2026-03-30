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


const TaskCreate = () => {
  const [project, setProject] = useState();
  const [employee, setEmployee] = useState();
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const {user} = useUser();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if(user?.role_id===1){
    showProjects()
      .then((res) => {
        setProject(res.data.projects);
        AssociatedEmployees(res.data.projects[0].id);
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
        project_id: data.project_id.trim(),
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
  <div className="min-h-screen bg-gray-100 p-6">
    
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
      
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {edit ? "Update Task" : "Create Task"}
      </h1>

      <form onSubmit={handleSubmit(onsubmit)} className="space-y-5">

        {/* Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Project
          </label>
          <select
            {...register("project_id", {
              required: { value: true, message: "Project is required" },
            })}
            onChange={(e) => AssociatedEmployees(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Project</option>
            {project?.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
          {errors.project_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.project_id.message}
            </p>
          )}
        </div>

        {/* Task Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <input
            {...register("title", {
              required: { value: true, message: "Task title is required" },
              minLength: {
                value: 3,
                message: "Task name must be at least 3 characters long",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <textarea
            {...register("description", {
              required: { value: true, message: "Task description is required" },
              minLength: {
                value: 8,
                message: "Task description must be at least 8 characters long",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Employee + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employees
            </label>
            <select
              {...register("assigned_to", {
                required: {
                  value: true,
                  message: "Employee needs to be assigned",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Employees</option>
              {employee?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.role_id === 2
                    ? `${emp.name} (Team Leader)`
                    : emp.name}
                </option>
              ))}
            </select>
            {errors.assigned_to && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assigned_to.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status", {
                required: { value: true, message: "Status is required" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

        </div>

        {/* Priority + Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              {...register("priority", {
                required: { value: true, message: "Priority is required" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              {...register("due_date", {
                required: { value: true, message: "Deadline is required" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.due_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.due_date.message}
              </p>
            )}
          </div>

        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {edit ? "Update Task" : "Create Task"}
        </button>

      </form>
    </div>
  </div>
);
};

export default TaskCreate;
