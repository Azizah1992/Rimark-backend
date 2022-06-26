const userSchema = new mongoose.Schema({
    username: String,
    secret_key: mongoose.ObjectId,
    password: String,
  })
  
  //define user model
//   const Users = mongoose.model("Users", userSchema)