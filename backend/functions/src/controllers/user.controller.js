const mongoose = require("mongoose");
const User = require("../models/user.model");
const { isValidEmail, isValidPhone } = require("../utils/validation");

const invalidDetails = "Enter a valid name, email address, and phone number.";
const publicUser = (user) => ({
    _id: user._id.toString(), name: user.name, email: user.email, mobile: user.mobile,
    createdAt: user.createdAt, updatedAt: user.updatedAt,
});

const normalizeUser = (body) => {
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const mobile = typeof body?.mobile === "string" ? body.mobile.trim() : "";
    if (name.length < 2 || name.length > 100 || !isValidEmail(email) || !isValidPhone(mobile)) return null;
    return { name, email, mobile };
};

const findDuplicate = async (details, excludeId) => {
    const filter = excludeId ? { _id: { $ne: excludeId } } : {};
    const [emailExists, mobileExists] = await Promise.all([
        User.exists({ ...filter, email: details.email }),
        User.exists({ ...filter, mobile: details.mobile }),
    ]);
    if (emailExists) return "A user with this email address already exists.";
    if (mobileExists) return "A user with this phone number already exists.";
    return null;
};

const sendFailure = (res, error) => {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "A user with these details already exists." });
    if (["ValidationError", "CastError"].includes(error.name)) return res.status(400).json({ success: false, message: invalidDetails });
    console.error("User request failed:", error.name);
    return res.status(500).json({ success: false, message: "Unable to process users right now." });
};

module.exports.adduser = async (req, res) => {
    const details = normalizeUser(req.body);
    if (!details) return res.status(400).json({ success: false, message: invalidDetails });
    try {
        const duplicate = await findDuplicate(details);
        if (duplicate) return res.status(409).json({ success: false, message: duplicate });
        const user = await User.create(details);
        return res.status(201).json({ success: true, message: "User added successfully.", user: publicUser(user) });
    } catch (error) {
        return sendFailure(res, error);
    }
};

module.exports.all = async (_req, res) => {
    try {
        const users = await User.find().select("_id name email mobile createdAt updatedAt").sort({ createdAt: -1 }).lean();
        return res.json({ success: true, users });
    } catch (error) {
        return sendFailure(res, error);
    }
};

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid user ID." });
    const details = normalizeUser(req.body);
    if (!details) return res.status(400).json({ success: false, message: invalidDetails });
    try {
        const duplicate = await findDuplicate(details, id);
        if (duplicate) return res.status(409).json({ success: false, message: duplicate });
        const user = await User.findByIdAndUpdate(id, { $set: details }, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        return res.json({ success: true, message: "User updated successfully.", user: publicUser(user) });
    } catch (error) {
        return sendFailure(res, error);
    }
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid user ID." });
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        return res.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        return sendFailure(res, error);
    }
};
