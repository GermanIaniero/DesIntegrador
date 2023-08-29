import productModel from "../mongoManager/models/productModel.js"
export default class ProductDbManager{
    constructor() {
        /*getById = async (id) => {   
        }   
    */
    }
    getProducts = async () => {
        return await productModel.find();  
    }

    setProduct = async (product) => {
        return await productModel.create(product);
    }

    updateProduct = async (product, id) => {
        return await productModel.updateOne(product, id);
    }

    deleteProduct = async (id) => {
        return await productModel.deleteOne(id);
    }
}