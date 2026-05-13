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
    <div>
      {
        user?.role_id != 1 &&
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
          Reason: 
            {/* Reason */}
            <input
              {...register("reason", {
                required: "Reason is required",
                minLength: {
                  value: 3,
                  message: "Reason must be at least 3 characters"
                }
              })}
              placeholder="Reason"
            />
            {errors.reason && <p>{errors.reason.message}</p>}
          Start Date:    
            {/* Start Date */}
            <input
              type="date"
              {...register("start_date", {
                required: "Start date is required"
              })}
            />
            {errors.start_date && <p>{errors.start_date.message}</p>}
            End Date;  
            {/* End Date */}
            <input
              type="date"
              {...register("end_date", {
                required: "End date is required",
                validate: (value) => {
                  const start = getValues("start_date");
                  return (
                    !start || value >= start || "End date must be after start date"
                  );
                }
              })}
            />
            {errors.end_date && <p>{errors.end_date.message}</p>}

            <button type="submit" disabled={isSubmitting}>
              Apply Leave
            </button>
          </form>
        </div>
      }
      {leaves.length == 0 ? <p>No Leaves Requests</p> : (
        leaves.map((l) => (
          <div key={l.id}>
            <p>Employee name: {l.user.name}</p>
            <p>Reason: {l.reason}</p>
            <p>Status: {l.status}</p>
            <p>Start Date: {l.start_date}</p>
            <p>End Date: {l.end_date}</p>
            {user?.role_id == 1 &&
              <>
                <button onClick={() => { handleApprove(l.id) }}>Approve</button>
                <button onClick={() => { handleReject(l.id) }}>Reject</button>
              </>
            }
          </div>
        ))
      )}
      <button disabled={current_page === 1} onClick={handlePrev}>Prev</button>
    
      { pages!=null && 
        Object.values(pages).map((p) => (
          p!=0 && 
          <button key={p} onClick={() => fetchData(p)}>{p}</button>
        ))
      }
        <button disabled={current_page === last_page} onClick={handleNext}>Next</button>
    </div>
  )
}

export default Leave
