const Application = require("./app/server");
require("dotenv").config();
const DB_URL = "mongodb://localhost:27017/LibraryManagmentDB";
new Application(7000 , DB_URL)