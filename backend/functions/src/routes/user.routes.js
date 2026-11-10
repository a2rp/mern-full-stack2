const router = require("express").Router();

const {
    adduser,
    all,
    updateUser,
    deleteUser
} = require("../controllers/user.controller");
const { requireAdmin } = require("../middlewares/auth.middleware");
const requireJson = require("../middlewares/require-json");

router.use(requireAdmin);
router.post("/add", requireJson, adduser);
router.get("/", all);
router.patch("/:id", requireJson, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
