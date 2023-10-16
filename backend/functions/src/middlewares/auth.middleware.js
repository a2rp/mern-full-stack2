require("dotenv").config();

const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");

module.exports.adminVerification = (req, res) => {
    // console.log(req.cookies, "req");
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

        return res.json({
            status: true,
            admin: admin.username
        });
    });
}

