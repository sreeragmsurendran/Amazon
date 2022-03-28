import  express  from 'express';
// import data  from './data.js'
import path from 'path';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import seedRouter from './Routes/seedRoutes.js';
import productRouter from './Routes/ProductRoute.js';
import userRouter from './Routes/UserRoute.js';
import orderRouter from './Routes/orderRoute.js';
// const express = require("express")
// const data = require("data")
const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Database is connected")
}).catch((err)=>{
    console.log(err.message)
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
  });
  
app.use('/api/seed',seedRouter);

app.use('/api/products',productRouter);
app.use('/api/users',userRouter);
app.use('/api/orders',orderRouter);


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err,req,res,next)=>{
res.status(500).send({message:err.message});
});
// app.get("/api/products",(req,res)=>{
//     res.send(data.products)
// });
// app.get("/api/products/slug/:slug",(req,res)=>{
//     const product = data.products.find(x=>  x.slug == req.params.slug)
//     // console.log(data.products)
//     // x.slug ===req.params.slug
//     // console.log(x.slug)
//     console.log(req.params.slug)

//     if(product){
//         res.send(product)
//     }else{
//         res.status(404).send({message:'Product Not found'})
//     }
   
// });
// app.get("/api/products/:id",(req,res)=>{
//     const product = data.products.find(x=>  x._id === req.params.id)
//     // console.log(data.products)
//     // x.slug ===req.params.slug
//     console.log("req.params._id")

//     console.log(req.params._id)
//     // console.log(req.params.slug)

//     if(product){
//         res.send(product)
//     }else{
//         res.status(404).send({message:'Product Not found'})
//     }
   
// });
const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`serving at http://localhost:${port}`);
})