import React, { useContext, useEffect, useReducer } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { Store } from '../Store'
import LoadingBox from './components/LoadingBox'
import MessageBox from './components/MessageBox'
import axios from 'axios'
import { getError } from '../utils'
import { Button } from 'react-bootstrap'
import {toast} from 'react-toastify'

const reducer =(state,action)=>{
  switch(action.type){
    case 'FETCH_REQUEST':
      return {...state, loading :true}
    case 'FETCH_SUCCESS':
      return {
        ...state,
      products: action.payload.products,
      page :action.payload.page,
      pages:action.payload.pages,
      loading :false,

    }
    case 'FETCH_FAIL':
      return {...state,loading : false ,error :action.payload}
    case 'CREATE_REQUEST':
      return {...state ,loadingCreate :true}
    case 'CREATE_FAIL':
      return {...state ,loadingCreate :false}
    case 'DELETE_REQUESTED':
        return {...state,loadingdelete :true, successDelete: false }
    case 'DELETE_SUCCESS':
        return {...state ,loadingdelete : false ,successDelete: true}
    case 'DELETE_FAIL':
      return {...state ,loadingdelete : false ,successDelete: false}
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default :
    return state ;
  }
  

}

export default function ProductListScreen() {
  const [{loading,error,products,pages, loadingCreate,successDelete, loadingdelete},dispatch] =useReducer(reducer,{
    loading:true,
    error:"",
  })
  const navigate = useNavigate();
  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const page=sp.get('page') || 1
  console.log("page",page)
  const {state} = useContext(Store);
  const {userInfo} =state;
 

  useEffect(() => {
    const fetchData= async()=>{
      try {
        const {data} =await axios.get(`/api/products/admin?page=${page}`,{
          headers: {Authorization :`Bearer ${userInfo.token}`}
        });
        console.log(data)
        dispatch({type:'FETCH_SUCCESS',payload :data})
      } catch (error) {
        dispatch({type:'FETCH_FAIL',payload :getError(error)})
      }
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
   
  }, [page, userInfo,successDelete])
  
const createHandler = async() => {
    console.log(userInfo.token)
    if(window.confirm('Are you sure to Create')){
      try {
        dispatch({type :'CREATE_REQUEST'})
        const {data} = await axios.post('/api/products',{},
        {
          headers:{
            authorization :`Bearer ${userInfo.token}`
          }
        }
        )
        console.log(data,"data")
        toast.success("Product created successfully")
       
        navigate(`/admin/product/${data.product._id}`)
       

      } catch (error) {
        toast.error(getError(error))
        dispatch({type :'CREATE_FAIL'})
      }
    
    }
  
  }
  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // if(products.length === 0){
        //   navigate(`admin/products?page=${}`)
        // }
        toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
          
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  
  return (
  <div>
      <h1>ProductList</h1>
      <div>
        <Button type='button' onClick={createHandler}>Create Product</Button>
      </div>
      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingdelete && <LoadingBox></LoadingBox>}

      {loading ? (<LoadingBox></LoadingBox>)
      :error ?( <MessageBox variant="danger">{error}</MessageBox>) 
      :(<>
      
       <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </Button> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}>
                {x + 1}
              </Link>
            ))}
          </div>
      </>)

      }
  </div>
  )
}
