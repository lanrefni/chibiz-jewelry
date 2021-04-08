const express = require("express");
const fs = require("fs");

let router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "upload route" });
});

module.exports = router;