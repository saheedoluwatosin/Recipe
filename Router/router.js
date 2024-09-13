const express = require("express")
const { register, login, recipe } = require("../Controler/controller")
const validtoken = require("../validateToken")



const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/recipe",validtoken, recipe)




module.exports = router