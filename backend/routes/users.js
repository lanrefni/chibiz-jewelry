const express = require("express");
const bcrypt = require("bcrypt")
const _ = require("lodash");
const { UserModel, validateUser, validateProds, validateUserUpdate, validatePassword } = require("../models/userModel");
const { authToken } = require("../middleware/authToken");
const { ProdModel, validateProd } = require("../models/prodModel");
const mongoose = require("mongoose")


const router = express.Router();

/* GET user info */
router.get("/me", authToken, async (req, res) => {
  let userData = await UserModel.findOne({ _id: req.userToken._id }, { password: 0 });
  res.json(userData);
});

/* GET user info with password */
router.get("/accMe", authToken, async (req, res) => {
  let userData = await UserModel.findOne({ _id: req.userToken._id })
  res.json(userData);
});

router.get("/prods", authToken, async (req, res) => {
  if (!req.query.numbers) {
    res.status(400).json({ msg: "YOu need to send query numbers of real prods" });
  }
  let prodNumbers_ar = req.query.numbers.split(",");
  let prodsData = await ProdModel.find({ "prodNumber": { $in: prodNumbers_ar } });
  res.json(prodsData);
})

/* Password Change */
router.patch("/changePass", authToken, async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const user = await UserModel.findOne({ _id: req.body._id })
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid Password" })
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.newPassword, salt);
    const data = await UserModel.updateOne({ _id: req.body._id }, { password: newPassword })
    res.status(201).json(data);
  }
  catch (err) {
    res.status(400).json(err)
  }
})

/* PUT changes to user */
router.put("/:id", authToken, async (req, res) => {
  const { error } = validateUserUpdate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }
  try {
    await UserModel.updateOne({ _id: req.params.id }, req.body);
    let userFind = await UserModel.findOne({ _id: req.params.id })
    res.json(userFind)

  }
  catch (err) {
    res.status(400).json(err)
  }

})


/* POST add user */
router.post("/", async (req, res) => {
  let { error } = validateUser(req.body);
  if (error) { return res.status(400).json(error.details); }
  try {
    let userData = await UserModel.findOne({ email: req.body.email })
    if (userData) { return res.status(400).json({ err: "user already in system, try log in" }); }
    let user = new UserModel(req.body);
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.json(_.pick(user, ["createdAt", "_id", "name", "email"]));
  }
  catch (err) {
    res.status(400).json({ err: err })
  }
})
module.exports = router;