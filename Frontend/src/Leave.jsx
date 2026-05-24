import React from 'react'
import { useState, useEffect } from 'react'
import { applyLeave, showMyLeaves, showLeaves, rejectLeave, approveLeave } from './api/leave.api'
import { useUser } from './context/UserContext';
import { useForm } from "react-hook-form";

const Leave = () => {
  const { user } = useUser();
  const [leaves, setLeaves] = useState([]);
  const [current_page, setCurrentPage] = useState();
  const [last_page, setLastPage] = useState();
  const [pages,setPages] = useState();
  

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitting, },
  } = useForm();

  function fetchData(page = 1) {
    if (user?.role_id == 1 || user?.role_id == 2) {
      showLeaves(page)
        .then((response) => {
          setLeaves(response.data.leaves.data);
          
          setCurrentPage(response.data.leaves.current_page);
          
          setLastPage(response.data.leaves.last_page);
        
          let cp = response.data.leaves.current_page;
          let lp = response.data.leaves.last_page;
          let x = 1;
            setPages(prev => {
            let new_obj = { p1:0,p2:0,p3:0 };
              
            if(lp>=3){
              if(cp==1){
                new_obj.p1=cp;
                new_obj.p2=cp+1;
                new_obj.p3=cp+2;
              }
              else if(cp > 1 && cp < lp){
                new_obj.p1=cp-1;
                new_obj.p2=cp;
                new_obj.p3=cp+1;
              }
              else if(cp==lp){
                new_obj.p1=cp-2;
                new_obj.p2=cp-1;
                new_obj.p3=cp;
              }
              }
            else{
              for (let i = 1; i <= lp; i++) {
             new_obj[`p${i}`] = i;
          }
            }

            
              return new_obj;
            });

        })
        .catch((error) => {
          if (error.response.status == "404") {
            alert("No leave requests found");
          }
          else {
            alert(error);
          }
        })
    }
    else if (user?.role_id == 3) {
      showMyLeaves(page)
        .then((response) => {
          setLeaves(response.data.leaves.data);
          setCurrentPage(response.data.leaves.current_page);
          setLastPage(response.data.leaves.last_page);
          let cp = response.data.leaves.current_page;
          let lp = response.data.leaves.last_page;
          let x = 1;
          
            setPages(prev => {
            let new_obj = { p1:0,p2:0,p3:0 };

            if(lp>=3){
              if(cp==1){
                new_obj.p1=cp;
                new_obj.p2=cp+1;
                new_obj.p3=cp+2;
              }
              else if(cp > 1 && cp < lp){
                new_obj.p1=cp-1;
                new_obj.p2=cp;
                new_obj.p3=cp+1;
              }
              else if(cp==lp){
                new_obj.p1=cp-2;
                new_obj.p2=cp-1;
                new_obj.p3=cp;
              }

            }
            else{
              for (let i = 1; i <= lp; i++) {
             new_obj[`p${i}`] = i;
          }
            }
              return new_obj;
            });

        })
        .catch((error) => {
          if (error.response.status == "404") {
            alert("No leave requests found");
          }
          else {
            alert(error);
          }
        })
    }
  }
  useEffect(() => {
    fetchData();
  }, [user])

  function handleApprove(id) {
    approveLeave(id)
      .then((response) => {

        setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l))

      })
      .catch((error) => {
        alert(error);
      })
  }
  function handleReject(id) {
    rejectLeave(id)
      .then((response) => {
        setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l))

      })
      .catch((error) => {
        alert(error);
      })
  }

  function handleNext() {
    if (user?.role_id == 3) {
      
      fetchData(current_page + 1)
    }
    else {
      console.log("entered")
      fetchData(current_page + 1)
    }
  }
  function handlePrev() {
    if (user?.role_id == 3) {
      fetchData(current_page - 1)
    }
    else {
      fetchData(current_page - 1)
    }
  }
  async function onSubmit(data) {
  const trimmedData = {
    reason: data.reason.trim(),
    start_date: data.start_date,
    end_date: data.end_date
  };

  try {
    const response = await applyLeave(trimmedData);

    alert(response.data.message);
    reset();
    fetchData();
  } catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;

      // show first error properly
      alert(Object.values(errors)[0][0]);
    } else {
      alert(error.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  }
}



return (
  <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto items-start">
    {/* Left Column: Apply Leave Form */}
    {user?.role_id != 1 && (
      <div className="w-full lg:w-1/3 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 sticky top-24">
        <div className="px-6 py-4 border-b-4 border-indigo-500 bg-indigo-50">
          <h1 className="text-xl font-bold text-gray-800">Apply Leave</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Request time off</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Reason</label>
            <input
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.reason ? 'border-red-300' : 'border-gray-300'}`}
              {...register("reason", {
                required: "Reason is required",
                minLength: { value: 3, message: "Reason too short" }
              })}
              placeholder="e.g. Medical leave"
            />
            {errors.reason && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.reason.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              {...register("start_date", { required: "Start date is required" })}
            />
            {errors.start_date && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.start_date.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              {...register("end_date", {
                required: "End date is required",
                validate: (value) => {
                  const start = getValues("start_date");
                  return !start || value >= start || "Invalid date range";
                }
              })}
            />
            {errors.end_date && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.end_date.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Submit Request"}
          </button>
        </form>
      </div>
    )}

    {/* Right Column: Leaves List */}
    <div className={`w-full ${user?.role_id != 1 ? 'lg:w-2/3' : 'lg:w-full'} space-y-6`}>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">Leave Requests</h2>

      {leaves.length == 0 ? (
        <div className="py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center text-gray-400">
          <p className="font-medium text-sm">No Leave Requests Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {leaves.map((l) => (
            <div key={l.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-bold text-slate-800">{l.user.name}</p>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                    l.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {l.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 italic">"{l.reason}"</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-1">
                  {l.start_date} <span className="mx-1">→</span> {l.end_date}
                </p>
              </div>

              {user?.role_id == 1  && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove(l.id)}
                    className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-xs font-black uppercase hover:bg-green-100 transition-colors"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(l.id)}
                    className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-xs font-black uppercase hover:bg-red-100 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Container */}
      <div className="flex justify-center items-center space-x-2 pt-6">
        <button
          disabled={current_page === 1}
          onClick={handlePrev}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
        >
          &larr;
        </button>
        {pages != null && Object.values(pages).map((p) => (
          p != 0 && (
            <button
              key={p}
              onClick={() => fetchData(p)}
              className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                current_page === p ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          )
        ))}
        <button
          disabled={current_page === last_page}
          onClick={handleNext}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
        >
          &rarr;
        </button>
      </div>
    </div>
  </div>
);
}

export default Leave
