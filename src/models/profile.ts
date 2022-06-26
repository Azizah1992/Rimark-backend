//profile schema 

// const mongoose = require("mongoose")

const profileSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    updated_at: Date,
    created_at: Date,
    user_id: mongoose.ObjectId,
  })
  
  // const profile = mongoose.model("profile", profileSchema)
  
  // module.exports = profile