const { User, Recipe, favorite } = require("../model/UserSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const senduserEmail = require("../mailsender")
const { response, request } = require("express")
const mongoose = require("mongoose")
const { default: rateLimit } = require("express-rate-limit")
const pagination = require("../Utilies")





const register =  async (request,response) => {
    const {firstName,lastName,email,username,password,favourite_cuisines}= request.body
    try {
        const alreadyUser = await User.findOne({username,email})
        if(alreadyUser){
            return response.status(404).json({
                message:"Please Kindly login"
            })
        }
        if(password.length < 8){
            return response.status(400).json({message:"Password must be 8 character or more"})

        }

        const hashedPassword = await bcrypt.hash(password,12)
        const newuser = new User({
            firstName,lastName,email,username,password:hashedPassword,favourite_cuisines
        })

        await newuser.save()
        await senduserEmail(email)

        return response.status(200).json({
            message:"Registration Successful",
            newuser
        })

        



    } catch (error) {
        return response.status(500).json({
            message: error.message
        })
    }
}

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `windowMs`
    message: "Too many login attempts from this IP, please try again after 15 minutes."
});


const login =async (request,response)=>{
    try {
        const{username,password} = request.body

        const user_login = await User.findOne({username})
        if(!user_login){
            return response.status(400).json({message:"User not found"})
        }

        const comparedPaasword = await bcrypt.compare(password,user_login.password)
        if(!comparedPaasword){
            return response.status(400).json({
                message:"Incorrect Username or Password"
            })
        }

        const accessToken = jwt.sign({user_login},`${process.env.ACCESS_URL}`,{expiresIn:"7d"})

        return response.status(200).json({
            message:"Successful Login",
            accessToken,
            user: user_login._id
            
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message
        })
    }
}

const recipe = async (request,response)=>{
    try {
        const {title,instruction,categories,ingredients}= request.body
    const authorId = request.user._id

    const new_recipe = new Recipe({title,instruction,categories,ingredients,authorId})
    await new_recipe.save()
    return response.status(200).json({message:"Successful"})
    } catch (error) {
        return response.status(500).json({message:error.message})
    }
    
}
//update recipes

const update_recipe = async(request,response)=>{
    try {
        const {instruction,ingredients} = request.body
        const {id}= request.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Recipe not found" });
        }
        const update_recipe = await Recipe.findByIdAndUpdate(id,{instruction,ingredients}, { new: true} )
        
        return response.status(200).json({message:"Recipe updated successfully",update_recipe})
    } catch (error) {
        return response.status(500).json({message:error.message})
        
    }
   
}
//delete recipe

const delete_recipe = async(request,response)=>{
    try {
        const {id}= request.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Recipe not found" });
        }
        const delete_recipe = await Recipe.findByIdAndDelete(id,{new:true})
        return response.status(200).json({message:"Successful deleted"})
    } catch (error) {
        return response.status(500).json({message:error.message})
    }
}

// search for recipes and pagination 
const search_recipe = async(request,response)=>{
    try {
        const {page,limit,skip} = pagination(request)
        const {category} = request.query
        const overallrecipe = await Recipe.find().limit(limit).skip(skip).sort("-createdAt")
        return response.status(200).json({
            message:"Successful",
            overallrecipe
        })
    } catch (error) {
        return response.status(500).json({error:error.message})
    }
    
}

//Rating

const Favorite = async(request,response)=>{
    const{recipeId}= request.body
    const userid =  request.user._id
    const {rating} = request.body

    const alreadyexistingfavorite = await favorite.findOne({user:userid,recipe:recipeId,rating:rating})
    if(alreadyexistingfavorite){
        return response.status(404).json({message:"Favorite already exist"})
    }
    const favoriterecipe = new favorite({ user: userid, recipe: recipeId, rating })
    await favoriterecipe.save()

    return response.status(200).json({message:"New Favorite successfully added"})

}

const all_user = async(request,response)=>{
    try {
        const all_user = await User.find()
        return response.status(200).json({all_user})
    } catch (error) {
        return response.status(500).json({message:error.message})
    }
}

const all_recipe = async(request,response)=>{
    try {
        const all_recipe = await Recipe.find()
        return response.status(200).json({all_recipe})
    } catch (error) {
        return response.status(500).json({message:error.message})
    }
}

const all_favorite = async(request,response)=>{
    try {
        const all_favorite1 = await favorite.find()
        return response.status(200).json({all_favorite1})
    } catch (error) {
        return response.status(500).json({message:error.message})
    }
}

module.exports = {
    register,
    login,
    recipe,
    all_user,
    all_recipe,
    update_recipe,
    delete_recipe,
    Favorite,
    all_favorite,
    loginLimiter,
    search_recipe
}