const User = require("../models/user.model");

module.exports.adduser = async (req, res, next) => {
    try {
        const { id, name, email, mobile } = req.body;
        if (!id || !name || !email || !mobile) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const isExistingId = await User.findOne({ id });
        if (isExistingId) {
            return res.json({
                success: false,
                message: "Id already exists"
            });
        }
        const isExistingName = await User.findOne({ name });
        if (isExistingName) {
            return res.json({
                success: false,
                message: "Name already exists"
            });
        }
        const isExistingEmail = await User.findOne({ email });
        if (isExistingEmail) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }
        const isExistingMobile = await User.findOne({ mobile });
        if (isExistingMobile) {
            return res.json({
                success: false,
                message: "Mobile already exists"
            });
        }

        const user = await User.create({ id, name, email, mobile });
        res.json({
            success: true,
            message: "User successfully",
            user
        });
        next();
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports.all = async (req, res, next) => {
    User.find().then((users) => {
        res.json({
            success: true,
            message: users
        });
    }).catch((error) => {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    });
};