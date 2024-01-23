const express = require("express")
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
let hbs = require('hbs')
const path = require('path')
const app = express();

const PORT = process.env.PORT || 100
//body parser
app.use(express.urlencoded({extended : false}))

//sessions
app.use(sessions({
  secret: "thisismysecrctekey",
  saveUninitialized:true,
  cookie: { maxAge: (1000*60*60) },
  resave: false
}))

app.use(cookieParser())

//Routers
app.use('/' , require('./src/routes/index'))
app.use('/users' , require('./src/routes/users').router)

//Set up path
const viewsPath = path.join(__dirname , './templates/views')
const partialsPath = path.join(__dirname , './templates/partials')

//set up hbs engine
app.set('view engine' , 'hbs')
app.set('views' , viewsPath)
hbs.registerPartials(partialsPath)

// Register a custom Handlebars helper
hbs.registerHelper("defaultValue", function(value, defaultValue) {
  return typeof value !== 'undefined' ? value : defaultValue;
});


//Port
app.listen(PORT , console.log(`server on port ${PORT}`))