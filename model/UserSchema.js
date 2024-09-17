



const mongoose = require("mongoose")



const user = mongoose.Schema({
    firstName: {type: String , require:true},
    lastName:{type:String , require:true},
    email:{type:String , require : true},
    username:{type:String, require : true},
    password: {type: String , require:true},
    favourite_cuisines:{type : String , require:true}
},
{
    timestamps:true
})

const User = mongoose.model("user",user)


const recipe = mongoose.Schema({

    title:{type:String, require:true},
    authorid:{type: mongoose.Schema.Types.ObjectId, ref: User, require:true },
    ingredients : {type:[String], require:true},
    instruction : {type:String},
    categories : {type:[String] , enum:['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Beverage',
      
        // Cuisines
        'Italian', 'Chinese', 'Mexican', 'Indian', 'Mediterranean', 'Thai', 'American', 'French', 'Japanese',
        
        // Dietary Preferences
        'Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'High-Protein',
        
        // Ingredient Types
        'Chicken', 'Beef', 'Pork', 'Seafood', 'Vegetables', 'Fruits', 'Grains', 'Legumes', 'Dairy',
        
        // Cooking Methods
        'Grilled', 'Baked', 'Fried', 'Steamed', 'Boiled', 'Roasted', 'Slow Cooked',
        
        // Nutrients
        'Calories', 'Protein', 'Fat and Oil', 'Carbohydrates', 'Fiber', 'Sugar', 'Vitamins', 'Minerals'] ,require:true}

},{
    timestamps:true
})

const Recipe = mongoose.model("recipe",recipe)

//FavouriteSchema
const favoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    rating:{type:Number,require:true,min:1,max:5}
  });

  const favorite = mongoose.model("favoriteSchema",favoriteSchema)

module.exports = {
    User,
    Recipe,
    favorite
}








