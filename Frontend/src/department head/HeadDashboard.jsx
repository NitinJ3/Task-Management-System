import React from 'react'
import { useState, useEffect } from 'react'
import { getTaskStatistics } from '../api/task.api'
import { getProjectStatistics } from '../api/project.api'

const HeadDashboard = () => {

  const [projectstats,setProjectStats] = useState({
    total:0,
    active:0,
    completed:0
  });
  const [taskstats,setTaskStats] = useState(({
    total:0,
    uncompleted:0,
    completed:0
  }));

  useEffect(()=>{

    getProjectStatistics()
    .then((response)=>{
      setProjectStats({total:response.data.total_projects,
        active:response.data.active_projects,
        completed:response.data.completed_projects
      })
      console.log(response.data)
    })
    .catch((error)=>{
      console.log(error);
    })

    getTaskStatistics()
    .then((response)=>{
      setTaskStats({
        total: response.data.total_tasks,
        uncompleted: response.data.non_completed_tasks,
        completed: response.data.completed_tasks,
      })
  })
    .catch((error)=>{
        console.log(error)
      })

  },[])

  return (
    <div>
      <h1>Head Dashboard</h1>
      <div>
        {}
        <h3>Total Projects</h3>
        <p>{projectstats?.total}</p>
      </div>
      <div>
        <h3>Active Projects</h3>
        <p>{projectstats?.active}</p>
      </div>
      <div>
        <h3>Completed Projects</h3>
        <p>{projectstats?.completed}</p>
      </div>
      <div>
        <h3>Total Tasks</h3>
        <p>{taskstats?.total}</p>
      </div>
       <div>
        <h3>Tasks Completed</h3>
        <p>{taskstats?.completed}/{taskstats?.total}</p>
      </div>
       <div>
        <h3>Unfinished Tasks</h3>
        <p>{taskstats?.uncompleted}</p>
      </div>
      
    </div>
  )
}

export default HeadDashboard
