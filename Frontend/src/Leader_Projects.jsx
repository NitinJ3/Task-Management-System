import React from 'react'
import { getTeamLeaderProjects } from './api/project.api'
import { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Leader_Projects = () => {

    const [projects,setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{

        getTeamLeaderProjects()
        .then((response)=>{
            setProjects(response.data.projects);
            console.log(response.data.projects);
        })
        .catch((error)=>{
            console.log(error);
        })

    },[])

    function viewTasks(id){
            navigate(`/tasks/${id}`);
    }

  return (
    <div>
        <h1>Team Leader Projects</h1>

        <div>
      {projects.length === 0 ? (
        <p>No Projects Found</p>
      ) : (
        <>
          <h2>Project List</h2>

          {projects.map((project) => (
            <div key={project.id}>
              <h3>Name: {project.name}</h3>

              <p> Start Date:
                {new Date(project.start_date + "T00:00:00").toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>

              <p> End Date:
                {new Date(project.end_date + "T00:00:00").toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>

                <p>Status: {project.status}</p>
                    <button onClick={()=>{viewTasks(project.id)}}>View Tasks</button>
            </div>
          ))}
        </>
      )}
    </div>

    </div>
  )
}

export default Leader_Projects
