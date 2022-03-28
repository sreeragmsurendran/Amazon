import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState, useReducer, useContext } from 'react'
import logger from 'use-reducer-logger'
// import Col from 'react-bootstrap'
import { Row, Col, ListGroup, Card, Badge, Button } from 'react-bootstrap'
import Rating from './components/Rating'
import MessageBox from './components/MessageBox'
import { getError } from '../utils'
import { Store } from '../Store'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state;
  }
}

function ProductScreen() {
  const navigate =useNavigate();
  const { slug } = useParams();
  // const slug = params;
  const [{ loading, error, product }, dispatch] = useReducer(logger(reducer), {
    product: [],
    loading: true,
    error: '',
  })

  useEffect(() => {

    const fetchData = async () => {

      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }


      // setProducts(result.data);
    }
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;


  const addCartHandler = async () => {
    // console.log("cart list")
    // console.log(cart)
    
    const existItem = cart.cartItem.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
        console.log(existItem)   

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry , Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    navigate('/cart');
  }
  

  return (
    loading ? <div>Loading...</div>
      : error ? <MessageBox variant="danger">{error}</MessageBox>
        :
        (
          <div>
            <Row>
              <Col md={6}>
                <img className='img-large' src={product.image} alt={product.name}>
                </img>
              </Col>
              <Col md={3}>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h1>{product.name}</h1>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating rating={product.rating} numReviews={product.numReviews}>
                    </Rating>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    Price : ${product.price}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description :
                    <p>{product.description}</p>
                  </ListGroup.Item>

                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        Price : ${product.price}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>
                            Status :
                          </Col>
                          <Col>
                            {product.countInStock > 0 ?
                              <Badge bg='success'>In stock</Badge>
                              : <Badge bg='danger'>out of stock</Badge>}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      {
                        product.countInStock > 0 && (
                          <ListGroup.Item>
                            <div className='d-grid'>
                              <Button onClick={addCartHandler} variant="primary">Add to Cart</Button>
                            </div>
                          </ListGroup.Item>
                        )
                      }
                    </ListGroup>
                  </Card.Body>
                </Card>

              </Col>
            </Row>
          </div>
        )
  )
}

export default ProductScreen