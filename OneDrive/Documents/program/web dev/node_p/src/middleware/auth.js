const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req,res,next)=>{  // next is used to redirect it to the router otherwise it will wait in this fxn
    try{
        const token = req.session.token
        const decoded = jwt.verify(token , 'saood')

        const user = await User.findOne({_id : decoded._id , 'tokens.token' : token })

        if(!user){
            throw new Error()
        }
        req.name = user.name
        next()
    }catch(e){
        res.render('login' , {errMsg : ['Please Login']})
    }

}

module.exports = auth