import cartModel from "../../models/cartModel.js"


export default class CartDbManager{
    constructor() {
        /*getById = async (id) => {   
        }   
    */
    }
    getCart = async () => {
        return await cartModel.find();  
    }

    setCart = async (cart) => {
        return await cartModel.create(cart);
    }
    getCartbyId = async (cart) => {
        carrito =  cartModel.find({id})
        return await carrito
    }
    updateCart = async (id,product) => {
        return await cartModel.updateOne({_id:id},product);
    }
    deleteProductById = async (cartId,productId)=>{
        const result = await cartModel.updateOne(
            { _id: cartId},
            { $pull: { products: { _id : productId } } },
          );
          return result
    }
    deleteProductAll = async (cartId)=>{
        const result = await cartModel.updateOne(
            { _id: cartId},
            { $set: { products: []} },
          );
          return result
    }
}