const router = require("express").Router();

const {
    adduser,
    all
} = require("../controllers/user.controller");

router.post("/add", adduser);
router.get("/", all);

module.exports = router;