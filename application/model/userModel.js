var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//var uri = "mongodb://localhost:27017/node-module";
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true });
class userModel
{

    constructor()
    {
        var userSchema = new mongoose.Schema({
                                firstName: {type:String, required: true},
                                lastName: {type:String, required: true},
                                email: {type:String, required: true},
                                gender: { type: String, required: true, enum:['Male','Female']},
                                DOB:Date,
                                profilePic:String,
                                password:String,
                                status: { type: String, default:'Inactive'},
                                updatedBy:String,
                                createdDate:{type:Date},
                                updatedDate:{type:Date, default:Date.now}
                          });
        this.CL_Users = mongoose.model("CL_Users", userSchema);
    }

    registerUser(userData) 
    {
        return new Promise((resolve,reject) => {
            var returnResponse = {};
            let checkValue = {email:userData.email};
            
            this.CL_Users.findOne(checkValue)
            .then((result) => {
                if(result)
                {
                    returnResponse['statusCode'] ='01';
                    returnResponse['message'] ='User already Exist.';
                    returnResponse['data'] = result;
                    reject(returnResponse);
                }
                else
                {   
                    var saveData = this.CL_Users(userData);            
                    saveData.save()
                    .then((userResult) => {
                        returnResponse['statusCode'] ='00';
                        returnResponse['message'] ='User Registerd successfully.';
                        returnResponse['data'] = userResult;
                        resolve(returnResponse);
                    })
                    .catch((err) => {
                        returnResponse['statusCode'] ='01';
                        returnResponse['message'] ='Technical Issue found.';
                        returnResponse['data'] = err;
                        reject(returnResponse);
                    });                     
                }
                
            })
            .catch((err) => {
                returnResponse['statusCode'] ='01';
                returnResponse['message'] ='Technical Issue found.';
                returnResponse['data'] = err;
                reject(returnResponse);
            });           
        });
    }

    userLogin(userData)
    {
        return new Promise((resolve, reject)=>{
            let returnResponse  = {};
            let checkValue      = {email:userData.username, password:userData.password};
            this.CL_Users.findOne(checkValue).then((userResult)=>{
                if(userResult)
                {
                    returnResponse['statusCode'] = '00';
                    returnResponse['message'] ='User Login successfully.';
                    returnResponse['data'] = userResult;
                    resolve(returnResponse);

                }
                else
                {
                    returnResponse['statusCode'] = '01';
                    returnResponse['message'] ='Invalid Email or Password please try again.';
                    returnResponse['data'] = userResult;
                    reject(returnResponse);
                }

            }).catch((error)=>{
                returnResponse['statusCode'] = '01';
                returnResponse['message'] ='Technical Issue found.';
                returnResponse['data'] = error;
                reject(returnResponse);

            });
        });
    }
    usersList()
    {        
     
        return new Promise((resolve, reject)=>{
            let returnResponse = {};
            this.CL_Users.find().then(userResult=>{
                //console.log(JSON.stringify(userResult));
                if(userResult)
                {
                    returnResponse['statusCode'] = '00';
                    returnResponse['message']    = 'No record found..!!';
                    returnResponse['data']      = userResult;
                    resolve(returnResponse);
                }
                else
                {
                    returnResponse['statusCode'] = '00';
                    returnResponse['message'] = 'No record found..!!';
                    resolve(returnResponse);
                }
            }).catch(error => {
                returnResponse['statusCode']  = '01';
                returnResponse['messageCode'] = 'Technical issue found..!!'
                reject(returnResponse);
            });
        });
    }

    userDeleteByID(userID)
    {
        return new Promise((resolve,reject)=>{
            let returnResponse  = {};
            let checkValue = this.CL_Users;
            checkValue.findById(userID).then(result => {
                if(result)
                {
                    this.CL_Users.findByIdAndDelete(userID).then(userResult =>{
                        returnResponse['statusCode'] = '00';
                        returnResponse['message'] = 'User removed successfully.';
                        resolve(returnResponse);
                    }).catch( userError => {
                        returnResponse['statusCode'] = '02';
                        returnResponse['message'] = 'Techinical issue found: '+ userError;
                        reject(returnResponse);
                    });
                    // returnResponse['statusCode'] = '00';
                    // returnResponse['message'] = 'User removed successfully.';
                    // resolve(returnResponse);
                }
                else{                    
                    returnResponse['statusCode'] = '01';
                    returnResponse['message'] = 'User not found..!!';
                    resolve(returnResponse);
                }

            }).catch(error => {
               // console.log('error '+error);
                returnResponse['statusCode'] = '02';
                returnResponse['message'] = 'Techinical issue found: '+ error;
                reject(returnResponse);
            })
        });
    }

    getUserInfoById(userID){
        return new Promise((resolve,reject) => {
            let returnResponse = {};
            this.CL_Users.findById(userID).then(result=>{
                if(result)
                {
                    returnResponse['statusCode'] = '00';
                    returnResponse['message'] = 'User found successfully.';
                    returnResponse['data'] = result;
                    resolve(returnResponse);
                }
                else
                {
                    returnResponse['statusCode'] = '01';
                    returnResponse['message'] = 'User Not found.';                    
                    reject(returnResponse);
                }

            }).catch(err=>{
                returnResponse['statusCode'] = '02';
                returnResponse['message'] = 'Techinical issue found: ' + err;                    
                reject(returnResponse);
            });
        });
    }

    addUser(userData){
        return new Promise((resolve,reject) => {
            var returnResponse = {};
            let checkValue = {email:userData.email};
            
            this.CL_Users.findOne(checkValue)
            .then((result) => {
                if(result)
                {
                    returnResponse['statusCode'] ='01';
                    returnResponse['message'] ='User already Exist.';
                    returnResponse['data'] = result;
                    reject(returnResponse);
                }
                else
                {   
                    var saveData = this.CL_Users(userData);            
                    saveData.save()
                    .then((userResult) => {
                        returnResponse['statusCode'] ='00';
                        returnResponse['message'] ='User Added successfully.';
                        returnResponse['data'] = userResult;
                        resolve(returnResponse);
                    })
                    .catch((err) => {
                        returnResponse['statusCode'] ='01';
                        returnResponse['message'] ='Technical Issue found.';
                        returnResponse['data'] = err;
                        reject(returnResponse);
                    });                     
                }
                
            })
            .catch((err) => {
                returnResponse['statusCode'] ='01';
                returnResponse['message'] ='Technical Issue found.';
                returnResponse['data'] = err;
                reject(returnResponse);
            });           
        });
    }

    updateUser(userData,userID){
        return new Promise((resolve,reject)=>{
            let returnResponse  = {};
            let checkValue = this.CL_Users;
            checkValue.findById(userID).then(result => {
                if(result)
                {
                    this.CL_Users.findOneAndUpdate({_id:userID},userData).then(userResult =>{
                        if(userResult)
                        {
                            returnResponse['statusCode'] = '00';
                            returnResponse['message'] = 'User update successfully.';
                            resolve(returnResponse);
                        }
                        else
                        {
                            returnResponse['statusCode'] = '01';
                            returnResponse['message'] = 'User not updated, Please try again..!!';
                            resolve(returnResponse);
                        }
                    }).catch( userError => {
                        returnResponse['statusCode'] = '02';
                        returnResponse['message'] = 'Techinical issue found 1: '+ userError;
                        reject(returnResponse);
                    });
                }
                else{                    
                    returnResponse['statusCode'] = '01';
                    returnResponse['message'] = 'User not found..!!';
                    resolve(returnResponse);
                }

            }).catch(error => {
                returnResponse['statusCode'] = '02';
                returnResponse['message'] = 'Techinical issue found 2: '+ error;
                reject(returnResponse);
            })
        });
    }
}

module.exports = new userModel();