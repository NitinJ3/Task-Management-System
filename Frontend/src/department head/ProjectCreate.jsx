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
          console.log(error);
          alert("Failed to update the project");
        });
    }
  }

  return (
    <div>

        {edit?<h1>Project Edit</h1>:<h1>Project Create</h1>}
      <form onSubmit={handleSubmit(onsubmit)}>
        <label>
          Project Name
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
          />
        </label>
        {errors.name && <p>{errors.name.message}</p>}
        <label>
          <textarea
            placeholder="Project Description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 8,
                message: "Description must be at least 8 characters long",
              },
            })}
          />
        </label>
        {errors.description && <p>{errors.description.message}</p>}
        <label>
          Status
          <select
            {...register("status", {
              required: "Status is required",
            })}
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        {errors.status && <p>{errors.status.message}</p>}

        <label>
          Team Leader
          <select
            {...register("team_leader", {
              required: "Team Leader is required",
            })}
          >
            <option value="">Select Team Leader</option>
            {team_leads?.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name}
              </option>
            ))}
          </select>
        </label>
  {errors.team_leader && <p>{errors.team_leader.message}</p>}
        <label>
          Start Date
          <input
            type="date"
            {...register("start_date", {
              required: "Start date is required",
            })}
          />
        </label>
        {errors.start_date && <p>{errors.start_date.message}</p>}

        <label>
          End Date
          <input
            type="date"
            {...register("end_date", {
              required: "End date is required",
              validate: (value) =>
                value > watch("start_date") ||
                "End date must be after start date",
            })}
          />
        </label>
        {errors.end_date && <p>{errors.end_date.message}</p>}

        <input type="submit" value={edit ? "Update" : "Create"} />
      </form>
    </div>
  );
};

export default ProjectCreate;
