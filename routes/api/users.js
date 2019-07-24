const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');

// @route   GET api/users
// @desc    test route
// @access  Public

router.get('/', (req,res) => {
    res.send('Test route for users');
});


// @route   POST api/users
// @desc    create a user in the database
// @access  Public
router.post('/', [
    //array of methods that check validity of user input
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({min: 6})
], async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        // Check if the email is already in the database
        let user = await User.findOne({email: email});
        if(user) {
            return res.status(400).json({errors: [{msg: "User already exists"}]});
        }

        // Create new user if its not in the database
        user = new User({
            name: name,
            email: email,
            password: password
        });

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        
        // Save the user to the database
        await user.save();

        // Return json webtoken
        const payload ={
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('secret'),
            {expiresIn: 3600},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        );

    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})

module.exports = router;