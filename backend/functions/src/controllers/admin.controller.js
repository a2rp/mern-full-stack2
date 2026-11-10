const crypto = require("crypto");
const Admin = require("../models/admin.model");
const { createSecretToken } = require("../utils/secret.token");
const { authCookieOptions, clearAuthCookieOptions } = require("../utils/auth-cookie");
const bcrypt = require("bcryptjs");
const { isValidEmail, isValidPassword, isValidPhone } = require("../utils/validation");

const publicAdmin = (admin) => ({ id: admin._id.toString(), name: admin.name, email: admin.email });
const isTokenSecretConfigured = () =>
    typeof process.env.TOKEN_KEY === "string" && Buffer.byteLength(process.env.TOKEN_KEY, "utf8") >= 32;

const registrationKeyIsValid = (providedKey) => {
    const expectedKey = process.env.ADMIN_REGISTRATION_KEY;
    if (!expectedKey || Buffer.byteLength(expectedKey, "utf8") < 32) return null;
    if (typeof providedKey !== "string") return false;
    const expected = Buffer.from(expectedKey, "utf8");
    const provided = Buffer.from(providedKey, "utf8");
    return expected.length === provided.length && crypto.timingSafeEqual(expected, provided);
};

const invalidAccountDetails = "Check the account details and try again.";

module.exports.register = async (req, res) => {
    if (!isTokenSecretConfigured()) return res.status(503).json({ success: false, message: "Authentication is not configured." });
    const keyIsValid = registrationKeyIsValid(req.get("x-admin-registration-key"));
    if (keyIsValid === null) return res.status(503).json({ success: false, message: "Admin registration is not configured." });
    if (!keyIsValid) return res.status(403).json({ success: false, message: "Unable to create an admin account." });

    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const city = typeof body.city === "string" ? body.city : "";
    const gender = typeof body.gender === "string" ? body.gender : "";
    const stateByCity = { mumbai: "maharashtra", pune: "maharashtra", ahmedabad: "gujarat" };
    const hearAbout = {};
    for (const option of ["linkedin", "friends", "job_portal", "others"]) {
        hearAbout[option] = body.hear_about_this?.[option] === true;
    }

    if (name.length < 2 || name.length > 80 || !isValidEmail(email) || !isValidPhone(phone)
        || !["male", "female", "others"].includes(gender) || !stateByCity[city]
        || !isValidPassword(body.password) || body.password !== body.confirm_password) {
        return res.status(400).json({ success: false, message: invalidAccountDetails });
    }

    try {
        if (await Admin.exists({ email })) {
            return res.status(409).json({ success: false, message: "Unable to create an admin account." });
        }
        const admin = await Admin.create({
            name, email, phone, gender, hear_about_this: hearAbout, city,
            state: stateByCity[city], password: body.password,
        });
        res.cookie("token", createSecretToken(admin._id), authCookieOptions);
        return res.status(201).json({ success: true, message: "Admin account created successfully.", admin: publicAdmin(admin) });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: "Unable to create an admin account." });
        if (error.name === "ValidationError") return res.status(400).json({ success: false, message: invalidAccountDetails });
        console.error("Admin registration failed:", error.name);
        return res.status(500).json({ success: false, message: "Unable to register right now." });
    }
};

module.exports.login = async (req, res) => {
    if (!isTokenSecretConfigured()) return res.status(503).json({ success: false, message: "Authentication is not configured." });
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim()
        || Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({ success: false, message: "Email or password is incorrect." });
    }
    try {
        const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select("+password");
        const passwordMatches = admin ? await bcrypt.compare(password, admin.password) : false;
        if (!admin || !passwordMatches) return res.status(401).json({ success: false, message: "Email or password is incorrect." });
        res.cookie("token", createSecretToken(admin._id), authCookieOptions);
        return res.json({ success: true, message: "Logged in successfully.", admin: publicAdmin(admin) });
    } catch (error) {
        console.error("Admin login failed:", error.name);
        return res.status(500).json({ success: false, message: "Unable to log in right now." });
    }
};

module.exports.logout = (_req, res) => {
    res.clearCookie("token", clearAuthCookieOptions);
    return res.json({ success: true, message: "Logged out successfully." });
};
