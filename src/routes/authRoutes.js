const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { check } = require("express-validator");

const router = express.Router();

// User Registration Route
router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password must be 6+ characters").isLength({ min: 6 }),
    ],
    registerUser
);

// User Login Route
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    loginUser
);

module.exports = router;
