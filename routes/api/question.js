const express = require('express')
const router = express.Router();

router.get('/', (req, res)=> res.json({test: "Question route success"}))

module.exports = router;
