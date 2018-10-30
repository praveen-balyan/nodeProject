
global.HOME_URL         = 'http://localhost:3000/';
global.APPLICATION_DIR  = path.join(PROJECT_DIR,'application');
global.CONFIG_DIR       = path.join(APPLICATION_DIR,'config');
global.CONTROLLER_DIR   = path.join(APPLICATION_DIR,'controller');
global.MODEL_DIR        = path.join(APPLICATION_DIR,'model');
global.VIEW_DIR         = path.join(APPLICATION_DIR,'views');
global.ASSETS_DIR       = path.join(PROJECT_DIR,'assets');
global.UPLOADS_DIR      = path.join(ASSETS_DIR,'uploads');

/************ Start code For upload user profile pic *********************/

var multer          = require('multer');
var profileStorage      = multer.diskStorage({ 
                            destination: function(req,file,callback){
                                callback(null,path.join(UPLOADS_DIR,'profile_pic'));
                            },
                            filename: function(req,file,callback){                            
                                var imgName = path.parse(file.originalname).name;
                                var imgExt  = path.parse(file.originalname).ext;
                                imgName = imgName.replace(/[^A-Z0-9]+/ig, "_");
                                callback(null,imgName + '-' + Date.now() + imgExt);
                            }
                        });
global.uploadProfile    = multer({ 
                            storage: profileStorage, 
                            fileFilter: function (req, file, callback) {
                                var ext = path.extname(file.originalname);
                                if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                                    req.body.imageValidationError = "Invalid File format.";
                                    return callback(null, false, req.imageValidationError);                                   
                                }
                                else{
                                    callback(null, true);
                                }                                                                    
                            }
                        });

/************ End Code For upload user profile pic *********************/