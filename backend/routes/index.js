const express = require("express");

let router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "all ok" });
});

module.exports = router;