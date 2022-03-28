import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import { Chart } from "react-google-charts";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{loading,summary ,error}, dispatch] = useReducer(reducer,{
    loading :true,
    // summary:{},
    error : '',
  });
  console.log( summary)
 
  const {state} = useContext(Store);
  const {userInfo} =state;
  useEffect(() => {
    const fetchData =async()=>{
      dispatch({type:'FETCH_REQUEST'})
      try {
        const {data} =await axios.get('/api/orders/summary',{
          headers: {Authorization :`Bearer ${userInfo.token}`}
        });
        // console.log(data)
        dispatch({type:'FETCH_SUCCESS',payload :data})
      } catch (error) {
        dispatch({type:'FETCH_FAIL',payload :getError(error)})
      }
    }
  
    fetchData();
  }, [userInfo])
  
  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (<LoadingBox/>):error ?(<MessageBox variant="danger">{error}</MessageBox>) 
      :(
        <>
        <Row>
        <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>
                  {summary.users && summary.users[0] ? summary.users[0].numUsers : 0}
                </Card.Title>
                <Card.Title>Users</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>
                {summary.orders && summary.users[0] ? summary.orders[0].numOrders: 0 }
                </Card.Title>
                <Card.Title>Orders</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>
                {summary.orders && summary.users[0] ? summary.orders[0].totalSales.toFixed(2): 0 }
                </Card.Title>
                <Card.Title>Orders</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className='my-3'>
          <h2>Sales</h2>
          {summary.dailyOrders.length === 0 ? (
            <MessageBox>No Sales</MessageBox>
          ) :(
            <Chart
            chartType="AreaChart"
            width="100%"
            loader={<div>Loading Chart....</div>}
            height="400px"
            data={[['Date','Sales'],...summary.dailyOrders.map((x)=>[x._id,x.sales])]}
          
          />
          )}
        </div>
        </>
      )}
      </div>

  )
}
