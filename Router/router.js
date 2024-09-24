const express = require("express")
const { register, login, recipe, all_user, all_recipe, update_recipe, delete_recipe, Favorite, all_favorite, loginLimiter, search_recipe } = require("../Controler/controller")
const validtoken = require("../validateToken")



const router = express.Router()

router.post("/register",register)
router.post("/login",loginLimiter, login)
router.post("/recipe",validtoken, recipe)
router.put("/updaterecipe/:id",validtoken, update_recipe)
router.post("/addfavrecipe/:id",validtoken, Favorite)
router.delete("/deleterecipe/:id",validtoken, delete_recipe)
router.get("/alluser", all_user)
router.get("/allrecipe", all_recipe)
router.get("/allfavorite", all_favorite)
router.get("/overallrecipe", search_recipe)

module.exports = router