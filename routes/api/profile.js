const express = require('express')
const router = express.Router();

router.get("/", (req, res)=>res.json({test: "profile auth success"}))

module.exports = router;