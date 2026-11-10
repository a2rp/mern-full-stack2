module.exports.isValidEmail = (email) =>
    typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

module.exports.isValidPhone = (phone) => typeof phone === "string" && /^\+?\d{7,15}$/.test(phone);

module.exports.isValidPassword = (password) =>
    typeof password === "string"
    && Buffer.byteLength(password, "utf8") <= 72
    && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,72}$/.test(password);
