import React from 'react'
import { useState, useEffect } from 'react'
import { getProjectsByEmployee } from './api/project.api';
import { getPersonalTaskStatistics } from './api/task.api';

const UserDashboard = () => {
   const [projectCount,setProjectCount] = useState(0)
    const [taskstats,setTaskStats] = useState({
      total:0,
      unfinished : 0,
      completed : 0
    })

    useEffect(()=>{

      getPersonalTaskStatistics()
          .then((response)=>{
            setTaskStats({
              total:response.data.total,
              unfinished:response.data.noncompleted,
              completed:response.data.completed
            })
          })
          .catch((error)=>{
            console.log(error);
          })

        getProjectsByEmployee()
            .then((response)=>{
              setProjectCount(response.data.count);
            })
            .catch((error)=>{
              console.log(error);
            });

    },[])



  return (
    <div>
      User Dashboard
      <div>
        <h3>Projects Assigned</h3>
        <p>{projectCount}</p>
      </div>
      
      <div>
        <h3>Personal Tasks Completed</h3>
        <p>{taskstats.completed}/{taskstats.total}</p>
      </div>
      
    </div>
  )
}

export default UserDashboard
