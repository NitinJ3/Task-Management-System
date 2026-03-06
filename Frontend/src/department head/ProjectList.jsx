import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showProjects } from "../api/project.api";

const ProjectList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    showProjects()
      .then((response) => {
        console.log(response.data);
        setData(response.data.projects);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  function handleView(id){
    navigate(`//head/projects/view/${id}`);
  }

  function handleCreate(){
    navigate("/head/projects/create")
  }




  return (
    <div>
      <div>
        <h1>Project List</h1>
        {data.map(
          (
            project, //card component containing few project details
          ) => (
            <div key={project.id}>
              <h3>Name: {project.name}</h3>
              <p>
                {new Date(project.start_date + "T00:00:00").toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>

              <p>
                {new Date(project.end_date + "T00:00:00").toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
              <button onClick={()=>{handleView(project.id)}}>View</button>
            </div>
          ),
        )}
      </div>

        <br></br> 
        {/* remove br */}

      <button onClick={handleCreate}>Create Project</button>
    </div>
  );
};

export default ProjectList;
