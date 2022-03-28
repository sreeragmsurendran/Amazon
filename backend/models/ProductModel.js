import mongoose from "mongoose";



const productSchema =new mongoose.Schema(
    {
        name:{type:String,required :true,unique:true},
        slug: {type:String,required :true,unique:true},
        category: {type:String,required :true},
        image:{type:String,required :true}, // 679px × 829px
        price:{type:Number,required :true},
        countInStock: {type:String,required :true},
        brand: {type:String,required :true},
        rating:{type:String,required :true},
        numReviews: {type:String,required :true},
        description: {type:String,required :true},
    },
    {
        timestamps:true
    }
    );
    const Product = mongoose.model("Product",productSchema)
    export default Product;