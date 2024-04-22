const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt')

// Signup function
const signup = async (req, res) => {

    // Checks if user already exists
    const user = await UserModel.findOne({ email: req.body.email })
    if(user){
        console.log("This user already exists, you have been logged in!")
        // Redirect them to log in page
        return res.redirect('/user/login')
    }
  
    try{
        // Creates new user and hashes the password
        const user = new UserModel(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
  
        // Returns the user data
        return res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: {
                firstName: UserModel.firstName,
                lastName: UserModel.lastName,
                email: UserModel.email
            }
        })
    }
    // Throws error if any
    catch(err){
        res.status(400).send(err.message)
    }
  }


// Login function
const login = async (req, res) => {

    // Obtains email and password from request body
    const { email, password } = req.body;

    try{
      // Uses login static function
        const user = await User.login(email, password);

        // Returns user data
        res.status(201).json({
            status: "success",
            message: "You logged in successfully",
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });
    }
    // Throws error if any
    catch(err){
        res.status(400).send(err.message)
    }
}


const logout = (req, res) => {
    // Implement log-out function later
    res.send('Logged out successfully')
}

// Exports all the functions
module.exports = {
    signup,
    login,
    logout
}






  