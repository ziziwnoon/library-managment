const { UserController } = require("../http/controllers/user.controller");
const { checkLogin } = require("../http/middleweares/autoLogin");
const { fileUploadWithMulter } = require("../modules/multer");

const router = require("express").Router();

router.get("/group/:id" , checkLogin , UserController.showUserGroups)

router.get("/profile" , checkLogin , UserController.getProfile)

router.get("/list" , checkLogin , UserController.getAllUsers)

router.get("/:id" , checkLogin , UserController.getUserById)

router.post("/edit/:id" , checkLogin , UserController.editUserById)

router.post("/profile-image" , checkLogin , fileUploadWithMulter.single("image") , UserController.updateProfileImage)

router.delete("/delete/:id" , checkLogin , UserController.removeUser)


module.exports = {
    UserRoutes  : router
}