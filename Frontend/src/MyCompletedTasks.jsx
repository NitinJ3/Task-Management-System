import React from 'react'
import { useEffect , useState } from 'react';
import { getCompletedTasks } from './api/task.api';
import { getProjectsByEmployee } from './api/project.api';
import { useNavigate } from 'react-router-dom';


const MyCompletedTasks = () => {
    const [projects, setProjects] = useState([]);
        const [tasks,setTasks] = useState([]);
        const navigate = useNavigate();
     
    function fetchTasks(id){
        getCompletedTasks(id)
        .then((response)=>{
            setTasks(response.data.completed);
        })
        .catch((error)=>{
            console.log(error);
        })
    }




      useEffect(()=>{
      
              getProjectsByEmployee()
              .then((response)=>{
                  setProjects(response.data.projects);
                  fetchTasks(response.data.projects[0].id);
              })
              .catch((error)=>{
                  console.log(error);
              })
      
          },[])  

          function handleView(id){
            navigate(`/mytasks/task/${id}`);
          }
  return (
    <div>
        {projects.length==0?<p>No Projects</p>:(
        <>
         <select
          defaultValue={projects[0]?.id}
          onChange={(e) => fetchTasks(e.target.value)}
        > 
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <h1>My Completed Tasks</h1>
        {tasks.length==0?"No completed tasks":(
            
            tasks.map((task) => (
            <div key={task.id}>
              <p>{task.title}</p>
              <p>{task.due_date}</p>
              <p>{task.status=="pending"?"New":""}</p>
              <button onClick={()=>handleView(task.id)}>View</button>
            </div>
         ))   
        )}
        </>
        )}
    </div>
  )
}

export default MyCompletedTasks
