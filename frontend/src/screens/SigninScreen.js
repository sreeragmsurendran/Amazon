import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link ,useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios"
import { Store } from '../Store';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate()
  const {search} =useLocation();
  console.log(search);
  const [email,setEmail] =useState('');
  const [password,setPassword]=useState('');
  const redirectUrl = new URLSearchParams(search).get('redirect');
  const redirect =redirectUrl ? redirectUrl:'/'
  console.log(redirect);
  const {state , dispatch :ctxDispatch} = useContext(Store);
  const {userInfo} =state;
  console.log("state");
  console.log(state);
  const submitHandler=async(e)=>{
    e.preventDefault(); 
    try{

      const {data} = await axios.post('/api/users/signin',{
        email,
        password,
      })
      ctxDispatch({type:'USER_SIGNIN',payload : data})
      console.log(data);
      localStorage.setItem('userInfo',JSON.stringify(data));
      navigate(redirect || '/')
    }catch(err){
     toast.error(getError(err))
    }
  }
  useEffect(() => {
   if(userInfo){
     navigate(redirect)
   } 
  }, [navigate,redirect,userInfo])
  
  return (
   <Container className='small-container m-auto'>
     
     <h1 className='my-3 ' > Sign In</h1>
       <Form onSubmit={submitHandler} className=''>
         <Form.Group className='col-lg-8' controlId="email">
           <Form.Label >Email</Form.Label>
           <Form.Control type='email' required onChange={(e)=>setEmail(e.target.value)}></Form.Control>
         </Form.Group>
         <Form.Group className='col-lg-8' controlId="password">
           <Form.Label >Password</Form.Label>
           <Form.Control type='password' required onChange={(e)=>setPassword(e.target.value)}></Form.Control>
         </Form.Group>
         <div className='mt-4 '>
           <Button type='submit'>Sign In</Button>
         </div>
         <div className='mb-3'>
           New Customer ?
           <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
         </div>

       </Form>
   </Container>
  )
}
