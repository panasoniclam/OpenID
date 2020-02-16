//import defendences
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config()
const app = express()
const server = require('http').Server(app)
const request = require('request')
const session = request('express-session')
app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(bodyParser.json())
const passport = require('passport');
app.use(passport.initialize())
app.use(passport.session())
app.use(session({
    secret:'secret squirrel',
    resave:false,
    saveUnintialized:true
}));
//setup passport

//not found
app.use((req,res,next)=>{
    const err = new Error('not found');
    err.status = 404;
    next(err)
})
// handle fucntion forward
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect('/')
    }
}
//set up route 
const index = require('./route/index')
const user = require('./route/user')
app.use('/',index)
app.use('/userinfo',checkAuthentication,user)

app.get('/login',passport.authenticate('openidconnect',{
    successRedirect:'/',
    scope:'profile'
}))

app.get('/_oauth/loginfpt',passport.authenticate('opentidconnect',{
    callback:true,
    successRedirect:'/userinfo',
    failureRedirect:'/'
}))
app.get('/logout',(req,res)=>{
    request.post("https://sso.csoc.fpt.net/openid/end-session",{
        'form':{
            'client_id':process.env.OIDC_CLIENT_ID,
            'client_secret':process.env.OIDC_CLIENT,
            'client_secret':process.env.OIDC_CLIENT_SECRET  ,
            'token':req.session.accessToken,
            'token_type_hint':'access_token'
        },
       
    },(req,respose,body)=>{
        respose.redirect('/')
    })
})
app.use((err,req,res,next)=>{
    const error = app.get('env') === 'development' ? err :{}
    const status = error.status || 500 ;
    res.status(status).json({
        message:err.message
    })
})
server.listen(process.env.PORT)