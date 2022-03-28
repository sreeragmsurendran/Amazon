import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';

export default function AdminRoutes({children}) {
    const navigate =useNavigate();
    const {state , dispatch :ctxDispatch} = useContext(Store);
    const {userInfo}= state;
  return userInfo && userInfo.isAdmin ? children : navigate('/signin')
}
