var express = require('express');
var router = express.Router();
const controller = require("../controllers/userController");
const {otpMiddleware} = require("../middleware/otpMiddleware");
const {session} = require('../helpers/commanHelper')
const  verifyToken  = require('../middleware/verifyToken').verifyToken;

router.get("/login", controller.login);
router.post("/login",otpMiddleware,controller.logInDone)

router.get("/otpVerify", controller.otpVerify);
router.post("/otpVerifyDone",controller.otpVerifyDone)

router.get("/changePassword", controller.changePassword);
router.post("/changePasswordDone", controller.changePasswordDone);


router.get("/", controller.dashboard);

module.exports = router;
