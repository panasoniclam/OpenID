const request = require('request');
const express = require('express');
const route = express.Router();

route.get('/',(req,res,next)=>{
    res.render('users',{
        title:'user',
        user:req.user
    })
})
route.get('/profile',(req,res,next)=>{
    request.get(
        'https://sso.csoc.fpt.net/openid/userinfo',
        {
            'auth':{
                'bearer':req.session.accessToken
            }
        }
    )
},(err,response,body)=>{
    res.render('profile',{
        user:JSON.parse(body)
    })
})

module.exports = route