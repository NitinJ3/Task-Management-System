import React, { useEffect ,useState} from 'react'
import { useParams } from "react-router-dom";
import { getProject } from '../api/project.api';
import { useNavigate } from 'react-router-dom';

const ProjectView = () => {
 const {id} = useParams();
 const [project,setProject] = useState(); 

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


//make style seem like a popup window
  return (
    project?(
        <div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>{project.department}</p>
            <p>{project.user.name}</p>
            <p>{project.start_date}</p>
            <p>{project.end_date}</p>
            <p>{project.status}</p>
            <button>Tasks</button>
            <button onClick={()=>{edit(project.id)}}>Edit</button>
        </div>
    ):(
        <div>No Project Found</div>
    )
  )
}

export default ProjectView
