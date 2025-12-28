const router = require("express").Router();
const Product = require("../models/Product");

router.post("/add", async (req,res)=>{
 const product = await Product.create(req.body);
 res.json(product);
});

router.get("/", async (req,res)=>{
 const products = await Product.find();
 res.json(products);
});

module.exports = router;
