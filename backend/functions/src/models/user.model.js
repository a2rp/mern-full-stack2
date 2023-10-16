const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        trim: true,
        required: [true, "Name Required"],
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Name Required"],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Invalid Email"
        },
        required: [true, "Email Required"]
    },
    mobile: {
        type: String,
        trim: true,
        required: [true, "Phone Number Required"],
        unique: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);