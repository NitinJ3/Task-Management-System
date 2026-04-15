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
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>
        <label>
          Select Project
          <select 
            {...register("project_id", {
              required: { value: true, message: "Project is required" },
              
            })}
           
            onChange = {(e)=>AssociatedEmployees(e.target.value)}
          >
            <option value="">Select Project</option>
            {project?.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
        </label>
        {errors.project_id && <p>{errors.project_id.message}</p>}

        <label>
          Task Name
          <input
            {...register("title", {
              required: { value: true, message: "Task title is required" },
              minLength: {
                value: 3,
                message: "Task name must be at least 3 characters long",
              },
            })}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </label>

        <label>Task Description</label>
        <textarea
          {...register("description", {
            required: { value: true, message: "Task description is required" },
            minLength: {
              value: 8,
              message: "Task description must be at least 8 characters long",
            },
          })}
        />
        {errors.description && <p>{errors.description.message}</p>}

        <label>
          Employees
          <select
            {...register("assigned_to", {
              required: {
                value: true,
                message: "Employee needs to be assigned",
              },
            })}
          >
            <option value="">Employees</option>
            {employee?.map((emp) => (
              <option key={emp.id} value={emp.id}>
               {emp.role_id === 2 ? `${emp.name} (Team Leader)` : emp.name}
              </option>
            ))}
          </select>
          {errors.assigned_to && <p>{errors.assigned_to.message}</p>}
        </label>
        <label>
          Status
          <select
            {...register("status", {
              required: { value: true, message: "Status is required" },
            })}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && <p>{errors.status.message}</p>}
        </label>

        <label>
          Priority
          <select
            {...register("priority", {
              required: { value: true, message: "Priority is required" },
            })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p>{errors.priority.message}</p>}
        </label>

        <label>
          Deadline
          <input
            type="date"
            {...register("due_date", {
              required: { value: true, message: "Deadline is required" },
            })}
          />
          {errors.due_date && <p>{errors.due_date.message}</p>}
        </label>

        <button type="submit">{edit ? "Update Task" : "Create Task"}</button>
      </form>
    </div>
  );
};

export default TaskCreate;
