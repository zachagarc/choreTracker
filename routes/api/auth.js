const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/users
// @desc    test route
// @access  Public

router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Server error"});
    }
});

// @route   POST api/users
// @desc    check username and password and return jwt if its valid
// @access  Public

router.post(
    '/', [
        check('email', 'Invalid Credentials').isEmail(),
        check('password', 'password field cannot be empty').not().isEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({email: email});

            if(!user) {
                return res.status(400).json({errors: [{msg: "Invalid Credentials"}]});
            }

            const ismatch = await bcrypt.compare(password, user.password);

            if(ismatch) {
                const payload = {
                    user: {
                        id: user.id
                    }
                }

                jwt.sign(
                    payload, 
                    config.get('secret'), 
                    {expiresIn: 3600},
                    (err, token) => {
                        if (err) throw err;
                        res.json({token});
                    }
                );

            } else {
                return res.status(400).json({errors: [{msg: "Invalid Credentials"}]});
            }

        }

        catch (err) {
            res.status(500).send('server error');
        }


    
})

module.exports = router;