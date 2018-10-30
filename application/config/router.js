var express         = require('express');
var router          = express.Router();
var pageController  = require(CONTROLLER_DIR + '/pageController');

router.route('/').get(pageController.HomePage);
router.route('/dashboard').get(pageController.userAuthenticate,pageController.Dashboard);
router.route('/register').get(pageController.RegisterPage);
router.route('/register').post(uploadProfile.single('profile_pic'),pageController.RegisterUser);
router.route('/login').get(pageController.chekUserLogin,pageController.LoginPage);
router.route('/login').post(pageController.chekUserLogin,pageController.LoginUser);
router.route('/logout').get(pageController.LogoutUser);
router.route('/users').get(pageController.UsersList);
router.route('/add-user').get(pageController.UserAddPage);
router.route('/add-user').post(uploadProfile.single('profile_pic'),pageController.UserAdd);
router.route('/deleteUser/:id').get(pageController.UserDelete);
router.route('/update-user/:id').get(pageController.UserUpdatePage);
router.route('/update-user/:id').post(uploadProfile.single('profile_pic'),pageController.UserUpdate);
router.route('/*').get(pageController.pageNotFound);

module.exports = router;