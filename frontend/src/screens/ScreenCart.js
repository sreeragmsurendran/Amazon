import React, { useContext } from 'react'
import { Button, Col, ListGroup ,Row ,Card} from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Store } from '../Store'
import MessageBox from './components/MessageBox';
import axios from "axios"

export default function ScreenCart() {
    const navigate= useNavigate();
    const {state , dispatch :ctxDispatch} = useContext(Store);
    const {
        cart :{
            cartItem
        }
    } = state;
    console.log("state")
    console.log(state)
    const updateCartHandler=async (item,quantity)=>{
        const {data} = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry , Product is out of stock');
            return;
          }
          ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    }
    const removeItemHandler = async (item)=>{
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item})
    }
    const checkOutHandler=()=>{
        navigate(`/signin?redirect=/shipping`)
    }

  return (
    <div>
        <h1>Shoping Cart</h1>
        <Row>
            <Col md={8}>
                {cartItem.length === 0 ? (
                <MessageBox>
                    Cart is Empty <Link to="/">Go Shopping</Link>
                </MessageBox>):
                (<ListGroup>
                    {
                        cartItem.map((item)=>(
                            <ListGroup.Item key={item._id}>
                                <Row  className="align-items-center">
                                    <Col md={4}>
                                        <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail"/>
                                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={3}>
                                    <Button variant="light" disabled={item.quantity ===1} onClick={()=>updateCartHandler(item,item.quantity - 1)}>
                                            <i className='fas fa-minus-circle'></i>
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button variant="light" onClick={()=>updateCartHandler(item,item.quantity + 1)}
                                        disabled={item.quantity ===item.countInStock}
                                        >
                                            <i className='fas fa-plus-circle'></i>
                                        </Button>
                                    </Col>
                                    <Col md={3}>${item.price}</Col>
                                    <Col md={2}>
                                    <Button variant="light" onClick={()=>removeItemHandler(item)}>
                                            <i className='fas fa-trash'></i>
                                    </Button>
                                    </Col>
                                </Row>

                            </ListGroup.Item>
                        ))
                    }
                </ListGroup>)
                }
                
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>
                                Quantity :{cartItem.reduce((a,c)=>a+ c.quantity,0)}
                            {/* { cartItem.reduce((a,c)=> a+ c.price *c.quantity)} */}
                                </h3>
                                <h3>Total Price : ${ cartItem.reduce((d,f)=> d+ f.price *f.quantity,0)}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button type='button' variant='primary' onClick={checkOutHandler} disabled={cartItem.length ===0}>
                                    Proceed To Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
  )
}
 