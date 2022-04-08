import axios from 'axios'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Store } from '../Store'
import { getError } from '../utils'
import LoadingBox from './components/LoadingBox'
import MessageBox from './components/MessageBox'

const reducer =(state ,action)=>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading :true}
        case 'FETCH_SUCCESS':
            return {...state,loading:false}
        case 'FETCH_FAIL':
            return {...state,loading:false ,error : action.payload}
        case 'UPDATE_REQUEST':
            return {...state ,loadUpdate: true }
        case 'UPDATE_SUCCESS':
            return {...state ,loadUpdate: false}
        case 'FETCH_FAIL':
            return {...state,loadUpdate: false}
        case 'UPLOAD_REQUEST':
          return {...state ,loadingUpload:true ,errorUpload:''}
        case 'UPLOAD_SUCCESS':
          return {
            ...state,loadingUpload:false,errorUpload:''
          }
        case 'UPLOAD_FAIL':
          return { ...state, loadingUpload:false, errorUpload:action.payload}
        default :
            return state
    }
}

export const ProductEditScreen = () => {
    const params = useParams()
    const {id :productId} = params;
    const {state} =useContext(Store);
    const {userInfo} = state;
    const [{loading,error, loadUpdate, loadingUpload},dispatch] =useReducer(reducer,{
        loading:false,
        error:'',
    })

    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState('')
    const [brand, setBrand] = useState('')
    const [description, setDescription] = useState('')
    const navigate =useNavigate();
    useEffect(() => {
        const fetchData =async()=>{
            try {
                dispatch({type:'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/products/${productId}`)
                setName(data.name);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setImage(data.image);
                setPrice(data.price);
                setSlug(data.slug);
                dispatch({type:'FETCH_SUCCESS'});
 
            } catch (error) {
                dispatch({
                    type :'FETCH_FAIL',
                payload :getError(error)})
                
            }
        }
        fetchData();
    }, [productId])
    const submitHandler=async(e)=>{
        e.preventDefault();
        try {
            
            dispatch({type :'UPDATE_REQUEST'})
            await axios.put(`/api/products/${productId}`,{
                _id:productId,
                name,
                slug,
                price,
                image,
                category,
                brand,
                countInStock,
                description,
            },
            {
                headers:{Authorization :`Bearer ${userInfo.token}` }
            });
            console.log("try")
            dispatch('UPDATE_SUCCESS');
            navigate('/admin/products')
        } catch (error) {
            console.log(error)
            toast.error(getError(error));
            dispatch({type :'UPDATE_FAIL'})
        }

    }
    const uploadFileHandle=async(e)=>{
          const file= e.target.files[0];
          const bodyFormData =new FormData();
          bodyFormData.append('file',file);
          try {
            dispatch({type:'UPLOAD_REQUEST'});
            const {data} = await axios.post(`/api/upload`,bodyFormData,{
              headers:{
                'ContentType':'multipart/form-data',
                Authorization:`Bearer ${userInfo.token}`
              }
            })
            dispatch({type:'UPLOAD_SUCCESS'})
            toast.success('Image upload success');
            setImage(data.secure_url)
          } catch (error) {
            toast.error(getError(error))
            dispatch({type:'UPLOAD_FAIL'})
          }
    }
  return (
      <Container className='small-container'>
            <h1>Edit Product ${productId}</h1>
            {loading ?( <LoadingBox></LoadingBox>)
            :error ?(<MessageBox variant="danger"></MessageBox>):
            ( <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" >
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={name} onChange={(e)=>setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>Slug</Form.Label>
                  <Form.Control type="text"  value={slug} onChange={(e)=>setSlug(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="text" value={price} onChange={(e)=>setPrice(e.target.value)} required />
                </Form.Group>
              
                <Form.Group className="mb-3">
                  <Form.Label>image</Form.Label>
                  <Form.Control  value={image} onChange={(e)=>setImage(e.target.value)} required/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Upload File</Form.Label>
                  <Form.Control   type="file" onChange={uploadFileHandle}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control  value={category} onChange={(e)=>setCategory(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control  value={brand} onChange={(e)=>setBrand(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Count in Stock</Form.Label>
                  <Form.Control  value={countInStock} onChange={(e)=>setCountInStock(e.target.value)} required/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control  value={description} onChange={(e)=>setDescription(e.target.value)} required/>
                </Form.Group>
                <Button disabled ={loadUpdate}variant="primary" type="submit">
                  Update
                </Button>
                {loadUpdate && <LoadingBox></LoadingBox>}
              </Form>
            )}
      </Container>
   
  )
}
