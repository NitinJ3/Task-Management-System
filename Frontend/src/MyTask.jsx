import React from 'react'
import { useEffect , useState } from 'react';
import { toDoTasks } from './api/task.api';
import { getProjectsByEmployee } from './api/project.api';
import { useNavigate } from 'react-router-dom';

const MyTask = () => {

    const [projects, setProjects] = useState([]);
    const [low,setLow] = useState([]);
    const [medium,setMedium] = useState([]);
    const [high,setHigh] = useState([]);
    const navigate = useNavigate();

    function fetchTasks(id){
             toDoTasks(id)
        .then((response)=>{
            setLow(response.data.low);
            setMedium(response.data.medium);
            setHigh(response.data.high);
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
            console.log(response.data.projects);
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
    {projects.length === 0 ? (
      <p>No tasks available</p>
    ) : (
      <>
        <select
          defaultValue={projects[0]?.id}
          onChange={(e) => fetchTasks(e.target.value)}
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <h1>My Tasks</h1>

        <h2>Low</h2>
        {low.length > 0 ? (
          low.map((task) => (
            <div key={task.id}>
              <p>{task.title}</p>
              <p>{task.due_date}</p>
              <button onClick={()=>handleView(task.id)}>View</button>
            </div>
          ))
        ) : (
          <p>No low priority tasks</p>
        )}

        <h2>Medium</h2>
        {medium.length > 0 ? (
          medium.map((task) => (
            <div key={task.id}>
              <p>{task.title}</p>
              <p>{task.due_date}</p>
              <button onClick={()=>handleView(task.id)} >View</button>
            </div>
          ))
        ) : (
          <p>No medium priority tasks</p>
        )}

        <h2>High</h2>
        {high.length > 0 ? (
          high.map((task) => (
            <div key={task.id}>
              <p>{task.title}</p>
              <p>{task.due_date}</p>
              <button onClick={()=>handleView(task.id)} >View</button>
            </div>
          ))
        ) : (
          <p>No high priority tasks</p>
        )}
      </>
    )}
  </div>
);
}

export default MyTask
