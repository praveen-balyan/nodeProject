var express     = require('express');
global.path     = require('path');
var app         = express();
var bodyParser  = require('body-parser');
var cookieParser  = require('cookie-parser');
var session     = require('express-session');
require('dotenv').config();

global.PROJECT_DIR = path.resolve(__dirname);
var constant    = require('./application/config/constant');
var router      = require('./application/config/router');

app.use(cookieParser());
app.use(session({'secret':'fsda34365!@@43r$%^ljlcd2', 'cookie':{secure:false,maxAge: 3000000},resave: true,saveUninitialized: true}));
app.use(function(req, res, next) {
    res.locals.loginUserInfo = req.session.loginUserInfo;
    next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('assets'));

app.set('views',VIEW_DIR);
app.set('view engine','ejs');

app.use('/', (req,res,next) =>{
    //console.log('Get new request on ' + Date.now());
    next();
});

app.use('/',router);

app.listen({ host : 'localhost', port : 3000 },function(){
    console.log('server listen at port: %s',3000);    
});
