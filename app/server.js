const createError = require("http-errors");
const path = require("path");
const { AllRoutes } = require("./router/router");
module.exports = class Application{
    #express = require("express");
    #app = this.#express();

    constructor(PORT , DB_URL){
        this.configDatabase(DB_URL);
        this.configApplication();
        this.configServer(PORT);
        this.createRoutes();
        this.errorHandler();
    }

    configApplication(){
        this.#app.use(this.#express.json())
        this.#app.use(this.#express.urlencoded({extended:true}))
        this.#app.use(this.#express.static(path.join(__dirname , ".." , "public")))
    }

    configServer(PORT){
        const http = require("http");
        const server = http.createServer(this.#app);
        server.listen(PORT , ()=>{
            console.log(`server running on ${PORT}`);
        })
    }

    configDatabase(DB_URL){
        const mongoose = require("mongoose");
        mongoose.connect(DB_URL , (error)=>{
            if (error) throw createError.BadRequest("connection failed");
            return console.log("connected to mongoose");
        })
    }

    errorHandler(){
        this.#app.use((req,res,next)=>{
            return res.status(404).json({
                status : 404 ,
                success : false ,
                message: "صفحه یافت نشد"
            })
        })

        this.#app.use((error,req,res,next)=>{
            const status = error?.status || 500;
            const message = error?.message || "internal server error";

            return res.status(status).json({
                status,
                success : false ,
                message
            })
        })
    }

    createRoutes(){
        this.#app.get("/" , (req,res,next)=>{
            return res.json({
                message : "Library Managment"
            })
        })

        this.#app.use(AllRoutes)
    }
}

