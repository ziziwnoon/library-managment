const {BookController} = require("../http/controllers/book.controller");
const { checkLogin } = require("../http/middleweares/autoLogin");
const { stringToArray } = require("../http/middleweares/stringToArray");
const { createBookValidator } = require("../http/validations/book");
const { fileUploadWithMulter } = require("../modules/multer");

const router = require("express").Router();

router.post("/create" , checkLogin ,fileUploadWithMulter.single("image"),createBookValidator() ,stringToArray("tags") , BookController.createBook)
router.get("/:id" , checkLogin , BookController.getBookById)
router.get("/list" , checkLogin , BookController.getAllBooks)
router.post("/edit/:id" , checkLogin , BookController.editBookById)

module.exports = {
    BookRoutes : router
}