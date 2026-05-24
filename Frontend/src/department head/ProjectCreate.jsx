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
  const [team_leads, setTeam_Leads] = useState();
  let check = null; //variable used to check if user is removed as team leader or not

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {

    //fetching team leads of head's department

    getDepartmentTeamLeads()
      .then((response) => {
        setTeam_Leads(response.data.team_leads);
        check = response.data.team_leads
       

      })
      .catch((error) => {
        if (error.response.status === "404") {
          console.log(error.response.data.message);
          setTeam_Leads([]);
        }
        else {
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
          let team_lead_name = "";
          if (response.data.project.user != null) {
            team_lead_name = response.data.project.user.name
          }
          else {
            setValue("team_leader", "");
          }
          
          const exists = check?.some(
            (lead) => lead.name === team_lead_name
          );
          if (!exists) {
            setValue("team_leader", "");
          }



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
  <div className="max-w-xl mx-auto my-10 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
    {/* Dynamic Header: Colors switch based on edit mode */}
    <div className={`px-8  py-6 border-b-4 ${edit ? 'border-amber-400 bg-amber-50' : 'border-indigo-500 bg-indigo-50'}`}>
      <h1 className="text-2xl font-bold text-gray-800">
        {edit ? "Project Edit" : "Project Create"}
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        {edit ? "Update the existing project details below." : "Fill in the details about the project."}
      </p>
    </div>

    <form onSubmit={handleSubmit(onsubmit)} className="p-8 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        
        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
          <input
            type="text"
            placeholder="Project Name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            {...register("name", {
              required: "Project Name is required",
              minLength: {
                value: 6,
                message: "Must be at least 6 characters",
              },
            })}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description</label>
          <textarea
            placeholder="Project Description"
            rows="4"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 8,
                message: "Description must be at least 8 characters long",
              },
            })}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
        </div>

        {/* Team Leader & Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Team Leader</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
              {...register("team_leader", {
                required: "Team Leader is required",
              })}
            >
              <option value="">{team_leads?.length == 0 ? "No Team Lead Available" : "Select Team Leader"}</option>
              {team_leads?.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
            {errors.team_leader && <p className="mt-1 text-sm text-red-500">{errors.team_leader.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
              {...register("status", {
                required: "Status is required",
              })}
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              {...register("start_date", {
                required: "Start date is required",
              })}
            />
            {errors.start_date && <p className="mt-1 text-sm text-red-500">{errors.start_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              {...register("end_date", {
                required: "End date is required",
                validate: (value) =>
                  value > watch("start_date") ||
                  "End date must be after start date",
              })}
            />
            {errors.end_date && <p className="mt-1 text-sm text-red-500">{errors.end_date.message}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button Section */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <input 
          type="submit" 
          value={edit ? "Update Project" : "Create Project"} 
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg cursor-pointer transition-all active:scale-95
            ${edit 
              ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200" 
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
            }`}
        />
      </div>
    </form>
  </div>
);
};

export default ProjectCreate;
