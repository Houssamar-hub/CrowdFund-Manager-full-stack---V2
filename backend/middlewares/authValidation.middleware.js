import {User} from "../models/user.model.js"
export const authValidationSingeup = (req, res, next) =>{
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields required" });

    next()
}
export const emailValidation = async (req, res, next) =>{
     const {  email  } = req.body;
    const existingUser = await  User.findOne({ email });
    
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });
   next()
}