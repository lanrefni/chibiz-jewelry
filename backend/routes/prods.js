const express = require("express");
const { authToken } = require("../middleware/authToken");
const { ProdModel, validateProd, generateProdNumber } = require("../models/prodModel")
const { UserModel } = require("../models/userModel")

const router = express.Router();

/* GET Search query */
router.get("/search", (req, res) => {
  let searchQ = req.query.q;
  let expSearchQ = new RegExp(searchQ, "i");
  ProdModel.find({ $or: [{ prodName: expSearchQ }] })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(400).json(err);
    })
})


/* GET Products according to gender and cat*/

router.get("/:prodType/:prodCatSecondary/gender", async (req, res) => {
  let perPage = 12;
  let page = req.query.page ? req.query.page * perPage : 0;
  let sortBy = req.query.sort ? req.query.sort : "_id";
  let sortOrder = req.query.reverse == "true" ? -1 : 1;
  try {
    if (req.params.prodCatSecondary === 'all') {
      const data = await ProdModel.find({ prodCat: req.params.prodType }).limit(perPage)
        .skip(page)
        .sort({ [sortBy]: sortOrder });
      const docsSum = await ProdModel.countDocuments({ prodCat: req.params.prodType });
      return res.json({
        page: req.query.page,
        numOfPages: parseFloat(docsSum / perPage),
        data,
      });
    }
    const data = await ProdModel.find({ prodCat: req.params.prodType, prodCatSecondary: req.params.prodCatSecondary }).limit(perPage)
      .skip(page)
      .sort({ [sortBy]: sortOrder });
    const docsSum = await ProdModel.countDocuments({ prodCat: req.params.prodType, prodCatSecondary: req.params.prodCatSecondary });
    return res.json({
      page: req.query.page,
      numOfPages: parseFloat(docsSum / perPage),
      data,
    });

  } catch (err) {
    return res.status(400).json(err);
  }
})

/* GET prod data according to ID */
router.get("/:id", async (req, res) => {
  let prodData = await ProdModel.findOne({ _id: req.params.id });
  res.json(prodData);
})

/* GET all prods */
router.get("/", async (req, res) => {
  let perPage = 12;
  let page = req.query.page ? req.query.page * perPage : 0;
  let sortBy = req.query.sort ? req.query.sort : "_id";
  let sortOrder = req.query.reverse == "true" ? -1 : 1;
  try {
    const data = await ProdModel.find({})
      .limit(perPage)
      .skip(page)
      .sort({ [sortBy]: sortOrder });
    const docsSum = await ProdModel.countDocuments({});
    return res.json({
      page: req.query.page,
      numOfPages: parseFloat(docsSum / perPage),
      data,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
});



/* POST add new prod */
router.post("/", authToken, async (req, res) => {
  let { error } = validateProd(req.body);
  if (error) { return res.status(400).json(error.details); }

  // Check if the user is admin or not
  let userData = await UserModel.findOne({ _id: req.userToken._id }, { password: 0 });
  if (userData.admin != true) { return res.status(400).json("You don't have permissions to add a new product"); }

  try {
    let prod = new ProdModel(req.body);
    prod.user_id = req.userToken._id;
    prod.prodNumber = await generateProdNumber(ProdModel)
    let defaultImg = "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    prod.prodImage = prod.prodImage || defaultImg;
    let prodData = await prod.save();
    res.status(201).json(prodData)
  }
  catch (err) {
    res.status(400).json(err)
  }
})


/* PUT changes to prod */
router.put("/:id", authToken, async (req, res) => {
  let { error } = validateProd(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let userData = await ProdModel.findOne({ _id: req.params.id })
    let prod = await ProdModel.findOneAndUpdate({ _id: req.params.id, user_id: userData.user_id }, req.body);
    if (!prod) return res.status(404).send('The prod with the given ID was not found.');

    prod = await ProdModel.findOne({ _id: req.params.id, user_id: userData.user_id });
    res.send(prod);

  }
  catch (err) {
    res.status(400).json(err)
  }

})

/* DELETE prod */
router.delete("/:id", authToken, async (req, res) => {
  let prod = await ProdModel.findOneAndDelete({ _id: req.params.id, user_id: req.userToken._id })
  if (!prod) {
    return res.status(400).json({ msg: "prod not found and cant be delted" });
  }
  res.json(prod);
})

module.exports = router;