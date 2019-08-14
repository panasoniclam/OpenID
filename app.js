//import defendences
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config()
const app = express()
const server = require('http').Server(app)
 
app.use(express.static(path.join(__dirname,'public')))

app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(bodyParser.json())
app.get('/',(req,res,next)=>{
    console.log(req.cookies)
})



//not found
app.use((req,res,next)=>{
    const err = new Error('not found');
    err.status = 404;
    next(err)
})
// handle fucntion forward
app.use((err,req,res,next)=>{
    const error = app.get('env') === 'development' ? err :{}
    const status = error.status || 500 ;
    res.status(status).json({
        message:err.message
    })
})
server.listen(process.env.PORT)