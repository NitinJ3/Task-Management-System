import { useEffect } from 'react'
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({children}) {
    const {authtoken} = useUser();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!authtoken){
            navigate('/login');
        }
    },[authtoken])

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute
