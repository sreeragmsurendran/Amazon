import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';

export default function ProtectedRoutes({children}) {
    const navigate =useNavigate();
    const {state , dispatch :ctxDispatch} = useContext(Store);
    const {userInfo}= state;
  return userInfo ? children : navigate('/signin')
}
