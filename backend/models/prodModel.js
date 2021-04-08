const mongoose = require("mongoose");
const Joi = require("joi");


const prodsSchema = new mongoose.Schema({
  prodName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  prodDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024
  },
  prodImage: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024
  },
  prodNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999
  },
  prodPrice: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 10
  },
  prodStock: {
    type: String,
    required: true,
    minlength: 1
  },
  prodCat: {
    type: String,
    required: true
  },
  prodCatSecondary: {
    type: String,
    required: true

  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

exports.ProdModel = mongoose.model("products", prodsSchema);


exports.generateProdNumber = async (ProdModel) => {
  while (true) {
    let randomNumber = Math.floor(Math.random() * 899000) + 100000;
    let prod = await ProdModel.findOne({ prodNumber: randomNumber });
    if (!prod) { return String(randomNumber); }
  }
}


exports.validateProd = (_prod) => {

  const schema = Joi.object({
    prodName: Joi.string().min(2).max(255).required(),
    prodDescription: Joi.string().min(2).max(1024).required(),
    prodPrice: Joi.string().min(1).max(10).required(),
    prodImage: Joi.string().min(11).max(1024).required(),
    prodStock: Joi.string().min(1).required(),
    prodCat: Joi.string().required(),
    prodCatSecondary: Joi.string().required(),
    _id: Joi.string()
  });

  return schema.validate(_prod);
}