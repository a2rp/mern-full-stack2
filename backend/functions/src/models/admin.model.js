const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true, minlength: 2, maxlength: 80 },
    email: {
        type: String, trim: true, lowercase: true, unique: true, required: true, maxlength: 254,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    phone: { type: String, trim: true, unique: true, required: true, match: /^\+?\d{7,15}$/ },
    gender: { type: String, enum: ["male", "female", "others"], required: true },
    hear_about_this: { type: mongoose.Schema.Types.Mixed, default: {} },
    city: { type: String, enum: ["mumbai", "pune", "ahmedabad"], required: true },
    state: { type: String, enum: ["gujarat", "maharashtra", "karnataka"], required: true },
    password: {
        type: String, required: true, select: false, minlength: 12, maxlength: 72,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,72}$/,
    },
}, { timestamps: true });

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("Admin", adminSchema);
