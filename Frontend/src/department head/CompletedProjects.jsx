import React from 'react'
import { useState, useEffect } from 'react'
import { getPrevious } from '../api/project.api'
import { useNavigate } from 'react-router-dom'

const CompletedProjects = () => {

    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        getPrevious()
            .then((response) => {
                setProjects(response.data.projects);
            })
            .catch((error) => {
                if (error.response.status == "404") {
                    alert("No Projects Found");
                }
                else {
                    console.log(error);
                }
            });


    }, []);

    function handleView(id) {
        navigate(`/head/projects/view/${id}/?completed=true`);
    }



    return (
        <div>
            <h1>Completed Projects</h1>
            {projects.length == 0 ? (<p>No completed projects</p>) : (

                projects.map((project) => (
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

                        <button onClick={() => handleView(project.id)}>View</button>
                    </div>
                ))

            )}
        </div>
    )
}

export default CompletedProjects
