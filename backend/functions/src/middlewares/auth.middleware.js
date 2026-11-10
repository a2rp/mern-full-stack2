const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Admin = require("../models/admin.model");

const unauthorized = (res) => res.status(401).json({ success: false, message: "Authentication required." });

module.exports.requireAdmin = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token || !process.env.TOKEN_KEY) return unauthorized(res);

    let payload;
    try {
        payload = jwt.verify(token, process.env.TOKEN_KEY, { algorithms: ["HS256"] });
    } catch {
        return unauthorized(res);
    }
    if (typeof payload.id !== "string" || !mongoose.isValidObjectId(payload.id)) return unauthorized(res);

    try {
        const admin = await Admin.findById(payload.id).select("_id name email");
        if (!admin) return unauthorized(res);
        req.admin = admin;
        return next();
    } catch (error) {
        console.error("Admin session lookup failed:", error.name);
        return res.status(500).json({ success: false, message: "Unable to verify the session right now." });
    }
};

module.exports.adminVerification = (req, res) => {
    if (!req.admin) return unauthorized(res);
    return res.json({
        success: true,
        admin: { id: req.admin._id.toString(), name: req.admin.name, email: req.admin.email },
    });
};
