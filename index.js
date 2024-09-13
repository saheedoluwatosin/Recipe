 
 const express = require("express")
 const mongoose = require("mongoose")
 const dotenv = require("dotenv").config()
 const router = require("./Router/router")

 const app = express()

app.use(express.json())

mongoose.connect(`${process.env.MONGO_URL}`)
        .then(()=> {
            console.log("Mongodb Connected.....")
        })

const PORT = process.env.PORT || 5000


app.listen(PORT, ()=>{console.log("Server Running")})
        
app.use(router)