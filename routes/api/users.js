const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    test route
// @access  Public

router.get('/', (req,res) => {
    res.send('Test route for users');
});

module.exports = router;