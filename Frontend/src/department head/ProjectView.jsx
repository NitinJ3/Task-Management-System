import React, { useEffect ,useState} from 'react'
import { useParams } from "react-router-dom";
import { getProject } from '../api/project.api';
import { useNavigate } from 'react-router-dom';
import { deleteProject } from '../api/project.api';
import { useSearchParams } from "react-router-dom";

const ProjectView = () => {
 const {id} = useParams();
 const [project,setProject] = useState(); 
 const [searchParams] = useSearchParams();
 const past = searchParams.get('completed') == "true";

const navigate = useNavigate();

useEffect(()=>{

    getProject(Number(id))
    .then((response)=>{
        console.log(response.data.project);
        setProject(response.data.project);
    })
    .catch((error)=>{
        if(error.response.status=="404"){
            console.log(error.response.data.message);
        }
        else{
            console.log(error);
        }
    });


},[]);


 function edit(id){

   navigate(`/head/projects/edit/${id}`);
  
}

    function destroy(id){

    deleteProject(id)
    .then((response)=>{
        console.log(response.data.message);
        alert(response.data.message);
        navigate("/head/projects");
    })
    .catch((error)=>{
        console.log(error);
        alert("Error deleting project: " + error.response.data.message);
    })   

    }

    function handleView(id){
        if(past){
                navigate(`/tasks/${project.id}/?completed=true`);
        }
        else{
        navigate(`/tasks/${project.id}`);
        }
    }


//make style seem like a popup window
  return (
    project?(
        <div>
            <h3>Name: {project.name}</h3>
            <p>Description: {project.description}</p>
            <p>Department: {project.department}</p>
            <p>Team Leader: {project.user?.name ? project.user.name:"Not Assigned"}</p>
            <p>Start Date: {project.start_date}</p>
            <p>End Date: {project.end_date}</p>
            <p>Status: {project.status}</p>
            <button onClick={()=>handleView(project.id)} >Tasks</button>
            <button onClick={()=>{edit(project.id)}}>Edit</button>
            <button onClick={()=>{destroy(project.id)}}>Delete</button>
        </div>
    ):(
        <div>No Project Found</div>
    )
  )
}

export default ProjectView
