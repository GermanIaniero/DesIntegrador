import { response, Router } from "express";
import productModel from "../models/productModel.js";
import cartModel from "../models/cartModel.js";
import passport from "passport";
import chatModel from "../models/modelMessage.js"

const router = Router()

router.get('/', async (req, res) => {
    //const products = await productModel.find().lean().exec()
    
    const page = parseInt(req.query?.page || 1)
    const limit = parseInt(req.query?.limit || 10)

    const queryParams = req.query?.query || '' //query=price,5
    const query = {}

    if (queryParams) {
        const field = queryParams.split(',')[0]
        let value = queryParams.split(',')[1]

        if (!isNaN(parseInt(value))) value = parseInt(value)

        query[field] = value
    }
    //*************************************** */

    const sortOrder = req.query?.sort
    console.log("aca el sort")


    const result = await productModel.paginate(query, {
        page,
        sort: { 'price': sortOrder === 'desc' ? -1 : 1 },
        limit,
        lean: true // Pasar a formato JSON
    })

    result.prevLink = result.hasPrevPage ? `/?page=${result.prevPage}&limit=${limit}` : ''
    result.nextLink = result.hasNextPage ? `/?page=${result.nextPage}&limit=${limit}` : ''

    console.log(result)
    const objetoPedido = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
    }
    const resultado= await cartModel.findOne();
    result.cartId = resultado._id
    res.render('home', result)   
    
   /*if (req.session?.user) {
        let user = (req.session.user)
        res.render('home', { products, user, result})    
    }
    else{
        res.render('home', { products, result})    
    }*/

})

router.get('/realTimeProducts', async (req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('realTimeProducts', { products })
})

router.get('/form-products', async (req, res) => {
    res.render('form', {})
})

router.get('/cartdetail/:cid', async (req, res) => {
    const cartId = req.params.cid
    const carts = await cartModel.findOne({ _id: cartId }).populate('products.pid').lean().exec()
    console.log(carts)
    res.render('cartDetail', { carts })

})

router.get('/chat', async (req, res) => {
    //res.render('chat', {}) // 

    const chat = await chatModel.find().lean().exec()
    res.render('chat', { chat })
})

router.get('/register', (req, res) => {
    if(req.session?.user) {
        res.redirect('/profile')
    }

    res.render('register', {})
})

function auth(req, res, next) {
    if(req.session?.user) return next()
    res.redirect('/')
}

router.get('/profile', auth, (req, res) => {
    const user = req.session.user

    res.render('profile', user)
})

router.get('/login', (req, res) => {
    res.render('login', {})
})

router.get(
    '/auth/google',
    passport.authenticate( 'google', { scope: ['profile', 'email' ] } ),
    (req, res) => { }
)

router.get(
    '/callback-google',
    passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.send('Logged !!')
})

router.post('/form-products', async (req, res) => {
    const data = req.body
    const result = await productModel.create(data)

    res.redirect('/')
})

router.post('/chat', async (req, res) => {
    const data = req.body
    const result = await chatModel.create(data)
    res.send(result)
})

export default router