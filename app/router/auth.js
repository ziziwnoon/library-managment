const { AuthController } = require("../http/controllers/auth.controller");
const { registerValidator, loginValidator, resetPasswordValidator } = require("../http/validations/auth");

const router = require("express").Router();

router.post("/reset-password/:id" , resetPasswordValidator() , AuthController.resetPassword)

router.post("/register" , registerValidator() , AuthController.register)

router.post("/login" , loginValidator() , AuthController.login)

router.get("/refresh-token"  , AuthController.signNewRfreshToken)


module.exports = {
    AuthRoutes  : router
}