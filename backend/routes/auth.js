
const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret")
const { UserModel } = require("../models/userModel");
const router = express.Router();

// login
router.post("/", async (req, res) => {
  let { error } = validLoginUser(req.body);
  if (error) { return res.status(400).json(error.details[0].message); }

  let user = await UserModel.findOne({ email: req.body.email });
  if (!user) { return res.status(400).json({ message: "Invalid email or password" }); }

  let validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) { return res.status(400).json({ message: "Invalid email or password" }); }

  res.json({ token: generateToken(user._id, user.admin) })
})
/* token generate */
const generateToken = (_id, _admin) => {
  let token = jwt.sign({ _id: _id, admin: _admin }, secret.JWTSecretKey, { expiresIn: "60mins" });
  return token;
}

const validLoginUser = (_userBody) => {
  let schema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(2).max(100).required()
  })
  return schema.validate(_userBody);
}

module.exports = router;