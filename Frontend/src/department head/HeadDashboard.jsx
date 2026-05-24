import React from 'react'
import { useState, useEffect } from 'react'
import { getTaskStatistics } from '../api/task.api'
import { getProjectStatistics } from '../api/project.api'

const HeadDashboard = () => {

  const [projectstats, setProjectStats] = useState({
    total: 0,
    active: 0,
    completed: 0
  });
  const [taskstats, setTaskStats] = useState(({
    total: 0,
    uncompleted: 0,
    completed: 0
  }));

  useEffect(() => {
    getProjectStatistics()
      .then((response) => {
        setProjectStats({
          total: response.data.total_projects,
          active: response.data.active_projects,
          completed: response.data.completed_projects
        })
      })
      .catch((error) => {
        console.log(error);
      })

    getTaskStatistics()
      .then((response) => {
        setTaskStats({
          total: response.data.total_tasks,
          uncompleted: response.data.non_completed_tasks,
          completed: response.data.completed_tasks,
          pending: response.data.pending_tasks
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-slate-800">Head Dashboard</h1>

      {/* Projects Section */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Total</h3>
            <p className="text-4xl font-bold text-slate-800">{projectstats?.total}</p>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-100 text-center">
            <h3 className="text-xs font-bold text-amber-700 uppercase mb-2">Pending</h3>
            <p className="text-4xl font-bold text-amber-800">
              {projectstats.total - projectstats.active - projectstats.completed}
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 text-center">
            <h3 className="text-xs font-bold text-blue-700 uppercase mb-2">Active</h3>
            <p className="text-4xl font-bold text-blue-800">{projectstats?.active}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100 text-center">
            <h3 className="text-xs font-bold text-green-700 uppercase mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-800">{projectstats?.completed}</p>
          </div>
        </div>
      </section>

      {/* Tasks Section */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Total</h3>
            <p className="text-4xl font-bold text-slate-800">{taskstats?.total}</p>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-100 text-center">
            <h3 className="text-xs font-bold text-amber-700 uppercase mb-2">Unfinished</h3>
            <p className="text-4xl font-bold text-amber-800">{taskstats?.uncompleted}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 text-center">
            <h3 className="text-xs font-bold text-blue-700 uppercase mb-2">Active / In Progress</h3>
            <p className="text-4xl font-bold text-blue-800">
              {taskstats?.pending}
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100 text-center">
            <h3 className="text-xs font-bold text-green-700 uppercase mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-800">{taskstats?.completed}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HeadDashboard