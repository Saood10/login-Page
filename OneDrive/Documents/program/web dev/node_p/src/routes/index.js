const express = require('express')
require('../db/mongoose')
const auth = require('../middleware/auth')

const router = express.Router()

// Login Page
router.get('/' , (req,res) => res.render('home'))
//dashboard page
router.get('/dashboard' ,auth , (req,res)=> res.render('dashboard',{
    name : req.name
}))

module.exports = router