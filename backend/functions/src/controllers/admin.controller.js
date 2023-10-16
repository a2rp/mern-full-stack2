const Admin = require("../models/admin.model");
const { createSecretToken } = require("../utils/secret.token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
    console.log(req.body, "req.body");
    try {
        const { name, email, phone, gender, hear_about_this, city, state, password, confirm_password } = req.body;
        if (!name || !email || !phone || !gender || !hear_about_this || !city || !state || !password || !confirm_password) {
            return res.json({
                success: false,
                message: "All fields are requied."
            });
        }

        if (password.trim() !== confirm_password) {
            return res.json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        const admin = await Admin.create({ name, email, phone, gender, hear_about_this, city, state, password });
        // const token = createSecretToken(user._id);
        // res.cookie("token", token, { withCredentials: true, httpOnly: false, });
        res.status(201).json({
            success: true,
            message: "User registered in successfully",
            admin
        });
        next();
    } catch (error) {
        // console.error(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                success: false,
                message: 'All fields are required'
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.json({
                success: false,
                message: 'Email not registered'
            });
        }

        const auth = await bcrypt.compare(password, admin.password);
        if (!auth) {
            return res.json({
                success: false,
                message: 'Password invalid'
            });
        }

        const token = createSecretToken(admin._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.json({
            success: true,
            message: "Admin logged in successfully",
            email: admin.email
        });
        next();
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

module.exports.logout = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.json({
            success: false,
            message: "Invalid token"
        });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({
                success: false,
                message: "Token Error"
            });
        }

        const admin = await Admin.findById(data.id);
        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found"
            });
        }

        // cookies.set("token", { expires: Date.now() });
        res.cookie("token", "", {
            withCredentials: true,
            httpOnly: false,
            maxAge: Date.now()
        });
        res.json({
            success: true,
            message: admin.username + " logged out successfully"
        });
    });
}

module.exports.all = async (req, res, next) => {
    Admin.find().then((admins) => {
        res.json({
            success: true,
            message: admins
        });
    }).catch((error) => {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    });
};

