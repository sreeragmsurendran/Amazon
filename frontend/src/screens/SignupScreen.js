import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link ,useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios"
import { Store } from '../Store';
import { getError } from '../utils';

export default function SignupScreen() {
    const navigate = useNavigate()
    const {search} =useLocation();
    const [email,setEmail] =useState('');
    const [password,setPassword]=useState('');
    const [name,setName] =useState('');
    const [confirmpassword,setConfirmPassword]=useState('');
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect =redirectUrl ? redirectUrl:'/'
    console.log(redirect);
    const {state , dispatch :ctxDispatch} = useContext(Store);
    const {userInfo} =state;
    console.log("state");
    console.log(state);
    if (password !== confirmpassword){
        toast.error('password doesnot match ');
    }
    const submitHandler=async(e)=>{
        e.preventDefault(); 
        try{
    
          const {data} = await axios.post('/api/users/signup',{
              name,
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
    <Container className='small-container'>
    <h1 className='my-3'> Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId="email">
        <Form.Group className='mb-3' controlId="password">
          <Form.Label >Name</Form.Label>
          <Form.Control type='text' required onChange={(e)=>setName(e.target.value)}></Form.Control>
        </Form.Group>
          <Form.Label >Email</Form.Label>
          <Form.Control type='email' required onChange={(e)=>setEmail(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className='mb-3' controlId="password">
          <Form.Label >Password</Form.Label>
          <Form.Control type='password' required onChange={(e)=>setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className='mb-3' controlId="password">
          <Form.Label >confirm Password</Form.Label>
          <Form.Control type='password' required onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <div className='mb-3'>
          <Button type='submit'>Sign In</Button>
        </div>
        <div className='mb-3'>
          Already have an account ?
          <Link to={`/signin?redirect=${redirect}`}>Login </Link>
        </div>

      </Form>
  </Container>
  )
}





