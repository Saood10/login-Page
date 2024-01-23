const express = require('express')
const mongoose = require('mongoose')
require('../db/mongoose')
const User = require('../models/user')

const router = express.Router()
//global var
let msg = undefined
let validationMsg = undefined
let errMsg = undefined
// Login Page
router.get('/login' , (req,res) => {res.render('login' , {
    msg,
    errMsg
})

    msg = undefined
    errMsg = undefined

})

// Register Page
router.get('/register' , (req,res) => res.render('register'))

//Register Handle
router.post('/register' , async(req,res)=>{
    const {name , email , password , password2} = req.body
    try {
        const user = new User(req.body)
        await user.save()
        msg = ['Registered successfully']
        
        res.redirect('login')
        
        
    }catch (error) {
        if (error instanceof mongoose.Error.ValidationError || error.errmsg ) {
        // Handle Mongoose validation errors
         validationMsg = error.errmsg ? 
        [ 'email taken ' ]
                :
         Object.values(error.errors).map(
            (err) => err.message
            )
        return res.status(400).render('register', {
            validationMsg,
            name,
            email,
            password,
            password2
        });
        }

        // Handle other types of errors
        res.status(500).send('<h1>Internal Server Error</h1>');
    }

})


//Register Handle
router.post('/login' , async(req,res)=>{
    
    try{
        const { email , password } =  req.body

        const user = await User.findBy(email , password)
        const token = await user.generateAuthToken()

        req.session.token = token

    }catch(e){
        errMsg = e
        return res.redirect('login')
    }
    
    res.redirect('/dashboard')

})

router.get('/logout' , (req,res)=>{
    delete req.session.token
    res.redirect('login')
})



module.exports = {router ,msg , errMsg}