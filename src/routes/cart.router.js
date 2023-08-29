import { Router } from 'express'
import cartModel from "../models/cartModel.js"
//import productModel from "../DAO/mongoManager/models/productModel.js";
import CartDbManager from "../DAO/FileManager/cartDb.manager.js";
import mongoose from "mongoose";

const router = Router()
const cartDbManager = new CartDbManager()
///////////trae todos los caritto del cart
router.get('/', async (req, res) => {
    // const result = await cartManager.list()
     //res.send(result)
     const carts = await cartModel.find().lean().exec()
     console.log(carts)
     res.send(carts) 
 })

 router.get('/:cid', async (req, res) => {
    const cartId= req.params.cid
    // const result = await cartManager.list()
     //res.send(result)
     const carts = await cartModel.find({_id:cartId}).populate('products.pid')
     console.log(carts)
     res.send(carts) 
 })

router.post('/', async (req, res) => {
   try {

   
    const result = await cartModel.create({})
    console.log(result)
    res.send(result)
    }catch (err) {
        console.log(err)
        res.send(err)

    }   
}) 

router.post('/:cid/products/:pid', async (req, res) => {
  
        const pid = req.params.pid
        const cid = req.params.cid 
        const quantity = parseInt(req.body.quantity)
        try{
            let resultDelCarrito = await cartModel.findOne({_id:cid});
            const resultDelProducto = await productModel.findOne({_id:pid});
            /* hacer push del id y no del producto */
            if (!resultDelProducto || !resultDelCarrito) res.status(404).send("No existe producto o carrito");
            
            
            const resultadoEncontrado = resultDelCarrito.products.find((producto) => producto.pid.toString() === pid)
            if (!resultadoEncontrado) {
                resultDelCarrito.products.push({pid,quantity} )
                await resultDelCarrito.save()
            }else{
                resultadoEncontrado.quantity+=quantity
                await resultDelCarrito.save()

            }    
            //resultDelCarrito.products.push({pid,quantity} )
            
            console.log(resultDelCarrito)
            res.send(resultDelCarrito)
         }catch (err) {
             console.log(err)
             res.send(err)
 
     }   
 }) 

//aca
router.post('/cart', async (req, res) => {
    const pid = req.params.pid
    const quantity = req.body.quantity
    
    try {
 
    
     const result = await cartModel.create({_id:pid, quantity})
     console.log(result)
     res.send(result)
     }catch (err) {
         console.log(err)
         res.send(err)
 
     }   
 }) 

 router.get('/cart/:pid', async (req, res) => {
    const pid = req.params.pid
    const cid = req.params.cid 
    const quantity = req.body.quantity || 1
    
    try {
 
        const resultDelCarrito = await cartModel.findOne({_id:cid});
        console.log(resultDelCarrito)

        if (!resultDelCarrito) res.status(404).send("No existe carrito"); 
    
        //let product = resultDelCarrito.products.find((producto) => producto.pid.toString() === pid)
        resultDelCarrito.products.push({ id: pid, quantity })

        const result = await resultDelCarrito.save()

        console.log(result)
        res.send("Carrito Actualizado")

     }catch (err) {
         console.log(err)
         res.send(err)
 
     }   
 }) 

router.delete('/:cid/products/:pid', async (req, res) => {
    const pid = req.params.pid
    const cid = req.params.cid 

    try{
   

        let result = await cartDbManager.deleteProductById(cid, pid)

        if (result === null) return res.send("Producto no encontrado")
        res.send({ status: "sucess", payload: result })
    } catch (err) {
        res.send({ status: "failed", error: err })
    }        
})

router.delete('/:cid', async (req, res) => {
    
    const cid = req.params.cid 

    try{
   

        let result = await cartDbManager.deleteProductAll(cid)

        res.send({ status: "sucess", payload: result })
    } catch (err) {
        res.send({ status: "failed", error: err })
    }        
})

router.put('/:cid/products/:pid', async (req, res) => {
  
    const pid = req.params.pid
    const cid = req.params.cid 
    const quantity = req.body.quantity

    try{


        const resultDelCarrito = await cartModel.findOne({_id:cid});
        console.log(resultDelCarrito)

        if (!resultDelCarrito) res.status(404).send("No existe carrito"); 
        
        let product = resultDelCarrito.products.find((producto) => producto.pid.toString() === pid)
        product.quantity = quantity
        
        const result = await resultDelCarrito.save()
        
        console.log(result)
        res.send("Carrito Actualizado")
     }catch (err) {
         console.log(err)
         res.send(err)

 }   
}) 



export default router