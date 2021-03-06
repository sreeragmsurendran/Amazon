import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store'
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import { getError } from '../utils';

const reducer =(state, action)=>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading  :true}
        case 'FETCH_SUCCESS':
            return {...state ,loading:false ,orders :action.payload}
        case 'FETCH_FAIL':
            return {...state, loading:false ,error:action.payload}
        case 'DELETE_RESET':
             return { ...state, loadingDelete: false, successDelete: false };
        default:
              return state;
    }
}

export const OrderListScreen = () => {
    const {state} = useContext(Store);
    const { userInfo } =state;
    const navigate = useNavigate();
    const [{loading,error ,orders,successDelete}, dispatch] = useReducer(reducer,{ 
        loading:true,
        error:'',
    })
    useEffect(() => {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/orders`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(err),
          });
        }
      };
      if (successDelete) {
        dispatch({ type: 'DELETE_RESET' });
      } else {
        fetchData();
      }
    }, [userInfo, successDelete]);
    
  return (
    <div>
        <h1>Order List</h1>
        {loading ? (<LoadingBox></LoadingBox>) : error ?(<MessageBox></MessageBox>) :
        (<table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user ? order.user.name : 'DELETED USER'}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>{order.totalPrice.toFixed(2)}</td>
              <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>

              <td>
                {order.isDelivered
                  ? order.deliveredAt.substring(0, 10)
                  : 'No'}
              </td>
              <td>
                <Button
                  type="button"
                  variant="light"
                  onClick={() => {
                    navigate(`/order/${order._id}`);
                  }}
                >
                  Details
                </Button>
                {/* &nbsp;
                <Button
                  type="button"
                  variant="light"
                  onClick={() => deleteHandler(order)}
                >
                  Delete
                </Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        )
        }
    </div>
  )
}
