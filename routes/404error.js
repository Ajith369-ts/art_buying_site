const express = require("express");

const router = express.Router();

const errorPage = require("../controllers/404error");

router.use(errorPage.error);

module.exports = router;