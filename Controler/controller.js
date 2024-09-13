const { User, Recipe } = require("../model/UserSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const senduserEmail = require("../mailsender")





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

module.exports = {
    register,
    login,
    recipe
}