const mongoose = require("mongoose");
const Joi = require("joi")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024
  },
  admin: {
    type: Boolean,
    default: false
  },
  prods: Array,
  quantity: Array,
  createdAt: {
    type: Date, default: Date.now()
  }
})
exports.UserModel = mongoose.model("users", userSchema);

exports.validateProds = (_prod) => {
  let schema = Joi.object({
    prods: Joi.array(),
    quantity: Joi.array()
  })
  return schema.validate(_prod);
}

exports.validateUser = (_user) => {
  let schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    admin: Joi.boolean(),
    _id: Joi.string()
  })

  return schema.validate(_user)
}

exports.validatePassword = (password) => {
  let schema = Joi.object({
    _id: Joi.string(),
    password: Joi.string().min(6).max(1024).required(),
    newPassword: Joi.string().min(6).max(1024).required(),
  })
  return schema.validate(password)
}

exports.validateUserUpdate = (_user) => {
  let schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024),
    admin: Joi.boolean(),
    _id: Joi.string()
  })

  return schema.validate(_user)
}