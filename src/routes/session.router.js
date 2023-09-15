import { Router } from "express";
import UserModel from "../models/user.model.js";
//import productModel from "../models/productModel.js";
import passport from "passport";
import {generateToken } from "../utils.js";

const router = Router()

router.get('/all', async(req, res) => { 
    let users = await UserModel.find()
    res.send(users)
   }
)

router.get('/login', async (req, res) => {
    res.render('login')  
    
})

router.post('/register', 
passport.authenticate('register', { failureRedirect: '/register', }),
async (req, res) => {
   try {
           
    let user = req.body
    const access_token = generateToken(user)

    res.cookie('coderCookie', access_token, {
        maxAge: 60*60*1000,
        httpOnly: true
    }).redirect("/login")
   
    }catch (e){  
        console.log(e);
    }    
   }) 

// Profile
function auth(req, res, next) {
    //if (req.user?.user) next()
    
     res.redirect('/login')
} 


router.delete("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
        } else {
          console.log('Sesión cerrada exitosamente');
          res.send("ok")
        }
    });
})

export default router