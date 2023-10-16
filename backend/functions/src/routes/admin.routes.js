const router = require("express").Router();

const {
    register,
    login,
    logout,
    all
} = require("../controllers/admin.controller");
const { adminVerification } = require("../middlewares/auth.middleware");

router.get("/", all);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/", adminVerification);

module.exports = router;
