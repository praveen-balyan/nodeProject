var validate = require('node-input-validator');
var userModel = require(MODEL_DIR + '/userModel');
var mergeJSON = require("merge-json") ;
let date        = require('date-and-time');
var fs        = require('fs');

module.exports.HomePage = (req, res) => {
    var dataObj = {page_title:"Node Module"};
    res
    .status(200)
    .send('Wellcome, This is home.');
}

module.exports.RegisterPage = (req, res) => {
    var dataObj = {page_title:"Node Module || Register User"};
    res
    .status(200)
    .render('register',dataObj);    
}

module.exports.RegisterUser = (req, res) => {

    //console.log(req.body);

    var userPostData = req.body;    
    var fileName = filePath = '';
    if(req.file)
    {
        fileName    = req.file.filename;
        filePath    = req.file.path;
    }
    var userSaveData = {
                        firstName: userPostData.f_name,
                        lastName: userPostData.l_name,
                        email: userPostData.email,
                        gender: userPostData.gender,
                        DOB: userPostData.dob,
                        profilePic:fileName,
                        password:userPostData.password,    
                        createdDate: Date.now()
                    };   
    
    var validator = new validate(userPostData, {
            f_name:'required:First Name|maxLength:50',
            l_name:'required:Last Name|maxLength:50',
            gender: 'required:Gender|in:Male,Female',
            dob:'required:Date of Birth|dateFormat:YYYY-MM-DD|before:2000-01-01',
            email:'required:E-mail|email',
            password:'required:Password|same:c_password'
    });

    validate.messages({
        required:":arg0 should not be blank.",
        'f_name.maxLength':"Maxlenth of First Name should be less then :arg0",
        'l_name.maxLength':"Maxlenth of Last Name should be less then :arg0",
        'email.required':":arg0 should not be blank.",
        'password.required':":arg0 should not be blank.",
        'password.same': 'The Password and Confirm Password should be same.',
        dateFormat:"Date should be in :arg0 format.",
        before:"Date of Birth should be before :arg0."
    });

    if(userPostData.imageValidationError)
    {
        validator.addError('profile_pic', 'image_validate', userPostData.imageValidationError);
    }
    
    var dataObj = {page_title:"Node Module || Register User",'fieldValue':userPostData};
    
    validator.check().then(function(matched){
        if(matched)
        {
          // console.log('value matched..!!!'+JSON.stringify(userSaveData)); 
           let userCreated = userModel.registerUser(userSaveData);
           userCreated.then((result) => {
                let finalResponse =  mergeJSON.merge(dataObj,result);
                res.status(200).render('register',finalResponse);
           }).catch(function(error){
                let finalResponse =  mergeJSON.merge(dataObj,error);
                if(filePath !=''){
                    fs.unlink(filePath, function (err) {
                        if (err) throw err;                
                        console.log('File deleted!');
                    });
                }
                res.status(200).render('register',finalResponse);
           });
        }
        else
        {
            let result = {'statusCode':'02','message':'User not registerd due to Field validation Error.', 'data':validator.errors}; 
            let finalResponse =  mergeJSON.merge(dataObj,result);      
            if(filePath !=''){
                fs.unlink(filePath, function (err) {
                    if (err) throw err;                
                    console.log('File deleted!');
                });
            }
            res.status(200).render('register',finalResponse);
        }
    });   
    
}

module.exports.LoginPage = (req, res) => {
    var dataObj = {page_title:"Node Module || Login User"};
   
    let userLoginInfo = req.cookies;
    if(userLoginInfo.loginUsername && userLoginInfo.loginPassword)
    {
        let postData = {fieldValue:{'username':userLoginInfo.loginUsername, 'password':userLoginInfo.loginPassword}};
        dataObj = mergeJSON.merge(dataObj,postData);
    }
    //console.log(JSON.stringify(req.session.loginUserInfo));
    res
    .status(200)
    .render('login',dataObj);
}

module.exports.LoginUser = (req, res) => {  

    var userPostData = req.body;    
    var validator = new validate(userPostData, {
        username:'required:E-mail|email',
        password:'required:Password'
    });

    validate.messages({
        required:":arg0 should not be blank.",
        'username.email':"Invalid Email address.",
        'password.required':":arg0 should not be blank.",        
    });

    var dataObj = {page_title:"Node Module || Login User",'fieldValue':userPostData};

    validator.check().then(function(matched){

        if(matched)
        {
            var userLogin = userModel.userLogin(userPostData);
            userLogin.then(result=>{
                if(userPostData.rememberMe=='Y')
                {
                    res.cookie('loginUsername',userPostData.username,{maxAge:360000});
                    res.cookie('loginPassword',userPostData.password,{maxAge:360000});
                }
                let userData = {'firstName':result.data.firstName,'lastName':result.data.lastName,'userName':result.data.firstName+" "+result.data.lastName ,'email':result.data.email,'firstName':result.data.dob,'firstName':result.data.dob,'userID':result.data._id};
                req.session.loginUserInfo = userData;
                //console.log('Cookies Data : '+ req.session.user);
                //res.status(200).render('login',finalResponse);
                res.redirect('/dashboard');
            }).catch(error=>{
                let finalResponse =  mergeJSON.merge(dataObj,error);
                //console.log('error page');
                res.status(200).render('login',finalResponse);
            });

        }
        else
        {
            let result = {'statusCode':'02','message':'User not registerd due to Field validation Error.', 'data':validator.errors}; 
            let finalResponse =  mergeJSON.merge(dataObj,result);       
            //console.log(JSON.stringify(finalResponse));     
            res.status(200).render('login',finalResponse);
        }
    });
}

module.exports.Dashboard = (req,res) => {
    let dataObj = {page_title:"Node Module || Dashboard"};
    res
    .status(200)
    .render('dashboard',dataObj);
}

module.exports.UsersList = (req,res) => {        
    let userList = userModel.usersList();
    //console.log(userList);
    userList.then((result) =>{
        let dataObj = {page_title:"Node Module || All Users",data:result.data};
        if(req.session.userMessage)
        {
            let sessioMessage = req.session.userMessage;
            dataObj = mergeJSON.merge(dataObj,sessioMessage);         
            delete req.session.userMessage;
        }  
        //console.log(JSON.stringify(dataObj));      
        res.status(200).render('user_list',dataObj);
    }).catch((error) => {
        res.send(error);
    });
}

module.exports.UserAddPage = (req,res) => {
    let dataObj = {page_title:"Node Module || Add User",actionType:'Add'};
    res.status(200).render('add-user',dataObj);
}

module.exports.UserUpdatePage = (req,res) => {
    let userID = req.params.id;
    let getUserInfo = userModel.getUserInfoById(userID);
    
    getUserInfo.then(result=>{
        let userDOB = '';
        if(result.data.DOB)
        {
            userDOB = date.format(result.data.DOB, 'YYYY-MM-DD');
        }
        let fieldValue = {f_name:result.data.firstName, l_name:result.data.lastName, email:result.data.email, gender:result.data.gender, dob:userDOB, profile_pic:result.data.profilePic,_id:result.data._id};
        
        let dataObj = {page_title:"Node Module || Add User", actionType:'Update', fieldValue:fieldValue, statusCode:'01'};
       // console.log(result.data);
        res.status(200).render('add-user',dataObj);
    }).catch(error=>{        
        console.log(error);
        res.status(200).redirect('/users');

    });
    
}

module.exports.UserUpdate = (req, res) => {
    let userID = req.params.id;
    var userPostData = req.body;    
    var fileName = filePath = '';
    if(req.file)
    {
        fileName    = req.file.filename;
        filePath    = req.file.path;
    }
    var userSaveData = {
                        firstName: userPostData.f_name,
                        lastName: userPostData.l_name,                        
                        gender: userPostData.gender,
                        DOB: userPostData.dob,                        
                        updatedDate: Date.now()
                    };   
    
    var validator = new validate(userPostData, {
            f_name:'required:First Name|maxLength:50',
            l_name:'required:Last Name|maxLength:50',
            gender: 'required:Gender|in:Male,Female',
            dob:'dateFormat:YYYY-MM-DD|before:2000-01-01',
    });

    validate.messages({
        required:":arg0 should not be blank.",
        'f_name.maxLength':"Maxlenth of First Name should be less then :arg0",
        'l_name.maxLength':"Maxlenth of Last Name should be less then :arg0",
        dateFormat:"Date should be in :arg0 format.",
        before:"Date of Birth should be before :arg0."
    });

    if(userPostData.imageValidationError)
    {
        validator.addError('profile_pic', 'image_validate', userPostData.imageValidationError);
    }
    
    var dataObj = {page_title:"Node Module || Register User",'fieldValue':req.body, actionType:'Update'};
    
    validator.check().then(function(matched){
        if(matched)
        {
            if(fileName){
                userSaveData = mergeJSON.merge(userSaveData,{profilePic:fileName});
            }
           
            let updateUserInfo = userModel.updateUser(userSaveData,userID);
            updateUserInfo.then((result) => {
                let dataObj = {'statusCode': result.statusCode, 'message':result.message};
                req.session.userMessage = dataObj;
                res.redirect('/users'); 
           }).catch(function(error){
                let finalResponse =  mergeJSON.merge(dataObj,error);
                if(filePath !=''){
                    fs.unlink(filePath, function (err) {
                        if (err) throw err;                
                        console.log('File deleted!');
                    });
                }
                console.log('Error Found: '+JSON.stringify(finalResponse));
                res.status(200).render('add-user',finalResponse);
           });
        }
        else
        {
            let result = {'statusCode':'02','message':'User not registerd due to Field validation Error.', 'data':validator.errors}; 
            let finalResponse =  mergeJSON.merge(dataObj,result);
            if(filePath !=''){
                fs.unlink(filePath, function (err) {
                    if (err) throw err;                
                    console.log('File deleted!');
                });
            }         
            console.log(JSON.stringify(finalResponse));
            res.status(200).render('add-user',finalResponse);
        }
    });   
    
}

module.exports.UserAdd = (req, res) => {

    var userPostData = req.body;   
    
    let fileName = filePath='';
    if(req.file)
    {
        fileName    = req.file.filename;
        filePath    = req.file.path;
    }
    var userSaveData = {
                        firstName: userPostData.f_name,
                        lastName: userPostData.l_name,
                        email: userPostData.email,
                        gender: userPostData.gender,
                        DOB: userPostData.dob,
                        profilePic:fileName,
                        password:userPostData.password,    
                        createdDate: Date.now()
                    };   
    
    var validator = new validate(userPostData, {
            f_name:'required:First Name|maxLength:50',
            l_name:'required:Last Name|maxLength:50',
            gender: 'required:Gender|in:Male,Female',
            email:'required:E-mail|email',
            password:'required:Password|same:c_password'
    });

    validate.messages({
        required:":arg0 should not be blank.",
        'f_name.maxLength':"Maxlenth of First Name should be less then :arg0",
        'l_name.maxLength':"Maxlenth of Last Name should be less then :arg0",
        'email.required':":arg0 should not be blank.",
        'password.required':":arg0 should not be blank.",
        'password.same': 'The Password and Confirm Password should be same.',
        dateFormat:"Date should be in :arg0 format.",
        before:"Date of Birth should be before :arg0."
    });

    if(userPostData.imageValidationError)
    {
        validator.addError('profile_pic', 'image_validate', userPostData.imageValidationError);
    }
    
    var dataObj = {page_title:"Node Module || Add New User", actionType:'Add', 'fieldValue':userPostData};
    
    validator.check().then(function(matched){
        if(matched)
        {
           let userCreated = userModel.addUser(userSaveData);
           userCreated.then((result) => {
                let dataObj = {'statusCode': result.statusCode, 'message':result.message};
                req.session.userMessage = dataObj;
                res.redirect('/users');              
           }).catch(function(error){
                let finalResponse =  mergeJSON.merge(dataObj,error);
                if(filePath !=''){
                    fs.unlink(filePath, function (err) {
                        if (err) throw err;                
                        console.log('File deleted! 1');
                    });
                }               
                res.status(200).render('add-user',finalResponse);
           });
        }
        else
        {
            let result = {'statusCode':'02','message':'User not registerd due to Field validation Error.', 'data':validator.errors}; 
            let finalResponse =  mergeJSON.merge(dataObj,result);
           if(filePath !=''){
                fs.unlink(filePath, function (err) {
                    if (err) throw err;                
                    console.log('File deleted!2');
                });
            }
            res.status(200).render('add-user',finalResponse);
        }
    });       
    
}

module.exports.UserDelete = (req,res) => {
    
    let userStatus = userModel.userDeleteByID(req.params.id);
    userStatus.then(result => {
            let dataObj = {'statusCode': result.statusCode, 'message':result.message};
            req.session.userMessage = dataObj;
            //console.log(JSON.stringify(dataObj));
            res.redirect('/users');
    }).catch(error => {
        res.send(error);
    });
   

}

module.exports.pageNotFound = (req,res) => {
    res.send('404 Page not found');
}

module.exports.userAuthenticate = (req,res,next) => {
    if(req.session.loginUserInfo)
    {
        //console.log('User Login..!!');
        next();
    }
    else
    {
        //console.log('User session destroy..!!');
        res.redirect('/login');
    }
}

module.exports.chekUserLogin = (req,res,next) => {
    if(req.session.loginUserInfo)
    {
        //console.log('User Login..!!');
        res.redirect('/dashboard');
    }
    else
    {
        //console.log('User session destroy..!!');
        next();
    }
}

module.exports.LogoutUser = (req,res) => {
    req.session.destroy();
    res.redirect('/login');
}