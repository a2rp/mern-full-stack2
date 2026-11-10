const router = require("express").Router();

const {
    register,
    login,
    logout
} = require("../controllers/admin.controller");
const { requireAdmin, adminVerification } = require("../middlewares/auth.middleware");
const requireJson = require("../middlewares/require-json");

router.post("/register", requireJson, register);
router.post("/login", requireJson, login);
router.post("/logout", logout);
router.post("/", requireAdmin, adminVerification);

module.exports = router;
