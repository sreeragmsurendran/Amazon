import express, { query } from "express"
import Product from '../models/ProductModel.js'
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from '../util.js';

const  productRouter =express.Router();

productRouter.get('/',async(req,res)=>{
    const product = await Product.find();
    res.send(product);
})

productRouter.post('/',isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
  const newproduct = await  new Product({
    name :'sample name'+ Date.now(),
    slug : 'sample-name-' +Date.now(),
    image: '/images/p2.jpg',
    price:0,
    category:"sample category",
    brand:'sample brand',
    countInStock:0,
    rating:0,
    numReviews :0,
    description :'sample description',
  })
const product = await newproduct.save();
res.send({message :"Product created",product});

}))

productRouter.put('/:id',isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
  const productId= req.params.id;
  const product = await Product.findById(productId)
  console.log("rating",req.body.rating)
  if (product){
      product.name =req.body.name,
      product.slug =req.body.slug,
      product.category=req.body.category,
      product.image =req.body.image,
      product.price =req.body.price,
      product.countInStock =req.body.countInStock,
      product.brand =req.body.brand,
      // product.rating =req.body.rating,
      // product.numReviews =req.body.numReviews,
      product.description =req.body.description,
      await product.save();
      console.log("productqwertyqwertrttyer1233444w",req.body)
      res.send({message:"Products updated "})
    }else{
      res.status(400).send({message:"Product update is failed"})
    }

}))

productRouter.delete('/:id',isAuth,isAdmin ,expressAsyncHandler(async(req,res)=>{
  console.log("hsdkukfhsdhfusheufhufhwe",req.params.id)
    const product = await Product.findById(req.params.id);
    console.log("product", product)
    if(product){
      const deletedProduct = await product.remove(); 
      res.send({message:"Product deleted"})
    }else {
      res.status(400).send({message:"Product Not deleted"})
    }
}
))

const PAGE_SIZE =3;
productRouter.get(
  '/admin/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async(req,res)=>{
    const {query} = req;
    const page =query.page || 1 ;
    const pageSize = query.pageSize ||  PAGE_SIZE;
    const products = await Product.find().skip(pageSize*(page - 1)).limit(pageSize);
    console.log(products)
    const countProducts =await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages:Math.ceil(countProducts/pageSize),
    })

  })

)




productRouter.get(
    '/search',
    expressAsyncHandler(async (req, res) => {
      const { query } = req;
      const pageSize = query.pageSize || PAGE_SIZE;
      const page = query.page || 1;
      const category = query.category || '';
      const price = query.price || '';
      const rating = query.rating || '';
      const order = query.order || '';
      const searchQuery = query.query || '';
  
      const queryFilter =
        searchQuery && searchQuery !== 'all'
          ? {
              name: {
                $regex: searchQuery,
                $options: 'i',
              },
            }
          : {};
      const categoryFilter = category && category !== 'all' ? { category } : {};
      const ratingFilter =
        rating && rating !== 'all'
          ? {
              rating: {
                $gte: Number(rating),
              },
            }
          : {};
      const priceFilter =
        price && price !== 'all'
          ? {
              // 1-50
              price: {
                $gte: Number(price.split('-')[0]),
                $lte: Number(price.split('-')[1]),
              },
            }
          : {};
      const sortOrder =
        order === 'featured'
          ? { featured: -1 }
          : order === 'lowest'
          ? { price: 1 }
          : order === 'highest'
          ? { price: -1 }
          : order === 'toprated'
          ? { rating: -1 }
          : order === 'newest'
          ? { createdAt: -1 }
          : { _id: -1 };
  
      const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);
  
      const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      });
      res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });
    })
  );
productRouter.get(
    '/categories',
    expressAsyncHandler(async (req, res) => {
      const categories = await Product.find().distinct('category');
      res.send(categories);
    })
  );
  

productRouter.get("/slug/:slug",async(req,res)=>{
    const product = await Product.findOne({slug :req.params.slug})
    // console.log(data.products)
    // x.slug ===req.params.slug
    // console.log(x.slug)
    console.log(req.params.slug)

    if(product){
        res.send(product)
    }else{
        res.status(404).send({message:'Product Not found'})
    }
   
});
productRouter.get("/:id",async(req,res)=>{
    const product = await Product.findById(req.params.id)
    // console.log(data.products)
    // x.slug ===req.params.slug
    console.log("req.params._id")

    console.log(product)
    // console.log(req.params.slug)

    if(product){
        res.send(product)
    }else{
        res.status(404).send({message:'Product Not found'})
    }
   
});
export default productRouter;