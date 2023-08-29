import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    id: Number,
    title:String,   
    description:String,
    price: Number,
    thumbnail:Array,
    code:Number,
    stock:Number,
    status:{type: Boolean, required:true, default:true},
    category:String,
    //Investigar requerido por defecto mongoose en js
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productCollection, productSchema)

export default productModel