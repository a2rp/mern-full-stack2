const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true, minlength: 2, maxlength: 100 },
    email: {
        type: String, trim: true, lowercase: true, unique: true, required: true, maxlength: 254,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    mobile: { type: String, trim: true, unique: true, required: true, match: /^\+?\d{7,15}$/ },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
