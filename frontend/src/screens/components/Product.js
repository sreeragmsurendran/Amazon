import React, { useContext ,useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import  Button  from 'react-bootstrap/Button'
import Rating from './Rating'
import { Store } from '../../Store'
import axios from 'axios'

function Product(props) {
    const {product} = props
    const {state , dispatch :ctxDispatch} = useContext(Store);
    const {
        cart :{
            cartItem
        }
    } = state;

    const addToCartHandler=async (item)=>{
        const existItem = cartItem.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry , Product is out of stock');
            return;
          }
          ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    }
    
    return (
        <Card key={product.slug} className="product">
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} className="card-img-top" />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                <Card.Title>${product.price}</Card.Title>
                {product.countInStock === 0  ?  <Button disabled >Out of stock</Button> :  <Button onClick={()=>addToCartHandler(product)}>Add to Cart</Button>}
               
            
            </Card.Body>
          
        </Card>
    )
}



export default Product
