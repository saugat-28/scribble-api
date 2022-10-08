const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET_KEY = "somekey@9812$"
// ROUTE 1: Create a User using POST "/api/auth/createuser". No Login required
router.post('/createuser', [
    // Check For Name Length >= 3, Email is valid and Password Length >= 5
    body('name', 'Invalid Name Value').isLength({ min: 3 }),
    body('email', 'Invalid Email Value').isEmail(),
    body('password', 'Invalid Password Value').isLength({ min: 5 }),
], async (req, res) => {
    // If there are errors in above check then return "Bad Request" and Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let success = false
        // Check Whether user with this email exists already
        let user = await User.findOne({ email: req.body.email })
        // If user already exists then return error message
        if (user) {
            return res.status(400).json({ success, error: "A user with this email already exists!" })
        }
        // Secure Password by converting to a hash using "bcryptjs"
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt)
        // Else Create a new User
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
        });
        // Creating a Authentication Token using "jsonwebtoken"
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET_KEY)
        success = true
        // Send new User's auth token as response
        res.json({ success, authToken })
    } catch (error) {
        // In case of some error log the error and return Error Message
        console.log(error.message)
        res.status(500).send("Some Error Occured!")
    }
})

// ROUTE 2: Authenticate a User using POST "/api/auth/login". No Login required
router.post('/login', [
    // Check For Name Length >= 3, Email is valid and Password Length >= 5
    body('email', 'Invalid Email Value').isEmail(),
    body('password', 'Password Cannot be blank').exists(),
], async (req, res) => {
    // If there are errors in above check then return "Bad Request" and Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let success = false;
        // Check if email exits in the database
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success, errors: "Username or Password Doesn't exists!" })
        }
        // Check if password is correct
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            
            return res.status(400).json({ success, errors: "Username or Password Doesn't exists!" })
        }
        // Creating a Authentication Token using "jsonwebtoken"
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET_KEY)

        // Send success and new User's auth token as response
        success = true
        res.json({ success, authToken })

    } catch (error) {
        // In case of some error log the error and return Error Message
        console.log(error.message)
        res.status(500).send("Some Error Occured!")
    }
})

// ROUTE 3: Get logged in User's details using POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        // In case of some error log the error and return Error Message
        console.log(error.message)
        res.status(500).send("Some Error Occured!")
    }

})

module.exports = router