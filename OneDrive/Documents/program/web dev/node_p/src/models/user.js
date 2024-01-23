const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const userSchema = mongoose.Schema({                        // used to apply middleware for hashing by bcrypt
    name:{
        type:String,
        required : [true , 'name is required'],
        trim:true

    },
    email:{
        type:String,
        required : [true , 'email is required'],
        trim:true,
        lowercase:true,
        validate:[{ validator : function(value){
                        return validator.isEmail(value)
                        },
                        message: 'Invalid email address'
                }
            ]
    },
    password:{
        type:String,
        required : [true , 'password is required'],
        trim:true,
            validate:[{ validator : function(value){
                            return value.length > 5
                        },
                        message: 'password length must be > 5 '

                        },
                        { validator : function(value){
                            return value !== 'password'
                        },
                        message: 'Invalid password '

                        },
                    ]
    },
    password2:{
        type:String,
        required : [true , 'confirm password is required'],
        trim:true,
        validate:[{ validator : function(value){
                        return value === this.password
                    },
                    message: 'password do not match'

                    }
                ]
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

},{
    timestamps:true
})

//check valid login

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()},'saood')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findBy = async (email , password) =>{

    const user = await User.findOne({ email })

    if(!user){
        throw (['email not registered'])
    }
    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
        throw (['password incorrect'])
    }
    return user
}

userSchema.pre('save' , async function (next) {

    const user = this
    
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password , 8)
        user.password2 = user.password
    }

    next() // this ends the process other wise it keeps on running
})

const User = mongoose.model('User' , userSchema)

module.exports = User