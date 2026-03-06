import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React, { use, useState, useEffect } from "react";
import { createTask } from "../api/task.api";
import { showProjects } from "../api/project.api";
import { getDepartmentEmployees } from "../api/user.api";

const TaskCreate = () => {
  const [project, setProject] = useState();
  const [employee, setEmployee] = useState();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    showProjects()
      .then((res) => {
        setProject(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });

    getDepartmentEmployees()
      .then((res) => {
        console.log(res.data.employees);
        setEmployee(res.data.employees);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function onsubmit(data) {
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

  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>
        <label>
          Select Project
          <select {...register("project_id", { required:{ value:true, message: "Project is required" } })}>
            <option value="">Projects</option>
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
          <select {...register("assigned_to", { required: { value: true, message: "Employee needs to be assigned" } })}>
            <option value="">Employees</option>
            {employee?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
          {errors.assigned_to && <p>{errors.assigned_to.message}</p>}
        </label>
        <label>
          Status
          <select {...register("status", { required: { value: true, message: "Status is required" } })}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && <p>{errors.status.message}</p>}
        </label>

        <label>
          Priority
          <select {...register("priority", { required: { value: true, message: "Priority is required" } })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p>{errors.priority.message}</p>}
        </label>

        <label>
          Deadline
          <input type="date" {...register("due_date", { required: { value: true, message: "Deadline is required" } })} />
          {errors.due_date && <p>{errors.due_date.message}</p>}
        </label>

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default TaskCreate;
