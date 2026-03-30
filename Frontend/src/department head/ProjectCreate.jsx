import React, { use, useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createProjects } from "../api/project.api";
import { useParams } from "react-router-dom";
import { updateProject } from "../api/project.api";
import { getProject } from "../api/project.api";
import { getDepartmentTeamLeads } from "../api/user.api";

const ProjectCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [team_leads,setTeam_Leads] = useState();
 

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {

//fetching team leads of head's department

        getDepartmentTeamLeads()
        .then((response)=>{
          setTeam_Leads(response.data.team_leads);
        })
        .catch((error)=>{
          if(error.response.status === "404"){
            console.log(error.response.data.message);
            setTeam_Leads([]);
          }
          else{
            console.log(error);
          }
        })


    //fetching project details if editing
    if (id) {
      setEdit(true);

      getProject(Number(id))
        .then((response) => {
          console.log(response.data.project);
           reset(response.data.project);

        })
        .catch((error) => {
          if (error.response.status == "404") {
            console.log(error.response.data.message);
          } else {
            console.log(error);
          }
        });



     
    }
  }, []);

  function onsubmit(data) {
    if (!edit) {
      const trimmeddata = {
        name: data.name.trim(),
        description: data.description.trim(),
        team_leader: data.team_leader,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
      };

      createProjects(trimmeddata)
        .then((response) => {
          console.log(response.data.message);
          alert("Project created successfully");
          reset();
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.errors);
        });
    } else {
      const trimmeddata = {
        id: id,
        name: data.name.trim(),
        description: data.description.trim(),
        team_leader: data.team_leader,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
      };

      updateProject(trimmeddata)
        .then((response) => {
          alert("Project updated successfully");
          console.log(response.data);
          navigate(`//head/projects/view/${id}`);
        })
        .catch((error) => {
          console.log(error.response.data);
          alert("Failed to update the project");
        });
    }
  }

 return (
  <div className=" flex items-center justify-center bg-gray-100 px-4">
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">

      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {edit ? "Project Edit" : "Project Create"}
      </h1>

      <form onSubmit={handleSubmit(onsubmit)} className="space-y-5">

        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            placeholder="Project Name"
            {...register("name", {
              required: "Project Name is required",
              minLength: {
                value: 6,
                message: "Must be at least 3 characters",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Description
          </label>
          <textarea
            placeholder="Project Description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 8,
                message: "Description must be at least 8 characters long",
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

        {/* Status + Team Leader (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status", {
                required: "Status is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Leader
            </label>
            <select
              {...register("team_leader", {
                required: "Team Leader is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {team_leads?.length == 0
                  ? "No Team Lead Available"
                  : "Select Team Leader"}
              </option>
              {team_leads?.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
            {errors.team_leader && (
              <p className="text-red-500 text-sm mt-1">
                {errors.team_leader.message}
              </p>
            )}
          </div>

        </div>

        {/* Dates (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              {...register("start_date", {
                required: "Start date is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.start_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.start_date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              {...register("end_date", {
                required: "End date is required",
                validate: (value) =>
                  value > watch("start_date") ||
                  "End date must be after start date",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.end_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.end_date.message}
              </p>
            )}
          </div>

        </div>

        {/* Submit */}
        <input
          type="submit"
          value={edit ? "Update" : "Create"}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
        />

      </form>
    </div>
  </div>
);
};

export default ProjectCreate;
