const { AuthRoutes } = require("./auth");
const { BookRoutes } = require("./book");
const { UserRoutes } = require("./user");

const router = require("express").Router();

router.use("/auth" , AuthRoutes);
router.use("/users" , UserRoutes);
router.use("/books" , BookRoutes);

module.exports = {
    AllRoutes : router
}