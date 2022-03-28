import React, { useContext ,useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useState } from 'react';
import { Store } from '../Store';
import { useNavigate, useParams } from 'react-router-dom'
import CheckoutSteps from './components/CheckoutSteps';

export default function ShoppingAddressScreen() {
    const navigate = useNavigate();
    const {state , dispatch :ctxDispatch} = useContext(Store);
    const {
        userInfo,
        cart:{shippingAddress},
    } =state;
    const [fullname, setFullName] = useState(shippingAddress.fullname || '');
    const [address, setAddress] = useState(shippingAddress.address||'');
    const [city, setCity] = useState(shippingAddress.city||'');
    const [postalcode, setPostalcode] = useState(shippingAddress.postalcode||'');
    const [country, setCountry] = useState(shippingAddress.country||'');
    

    const submitHandler=(e)=>{
        e.preventDefault();
        
        ctxDispatch({type :'SAVE_SHIPPING_ADDRESS',payload:{
          fullname,
          address,
          city,
          postalcode,
          country,
        } });
        localStorage.setItem('shoppingAddress',JSON.stringify(
            {
                fullname,
                address,
                city,
                postalcode,
                country,
              }
        ));
        navigate('/payment');
    };
    useEffect(() => {
    if(!userInfo){
        navigate('/signin?redirect=/shipping')
    }
    })
    
  return (
    <div>
        <CheckoutSteps step1 step2  ></CheckoutSteps>
      <div className='container small-container'>
        <h1 className='my-3'>Shopping Address</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='fullname'>
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={fullname} onChange={(e)=>setFullName(e.target.value)}/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control value={address} onChange={(e)=>setAddress(e.target.value)}/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='fullname'>
                <Form.Label>City</Form.Label>
                <Form.Control value={city} onChange={(e)=>setCity(e.target.value)}/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='fullname'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control value={postalcode} onChange={(e)=>setPostalcode(e.target.value)}/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='fullname'>
                <Form.Label>Country</Form.Label>
                <Form.Control value={country} onChange={(e)=>setCountry(e.target.value)}/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='fullname'>
                <Button variant='primary' type='submit'>Continue</Button>
            </Form.Group>
        </Form>
        </div>
    </div>
  )
}
