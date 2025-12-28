const router = require("express").Router();
const Razorpay = require("razorpay");

const razor = new Razorpay({
 key_id: process.env.RAZORPAY_KEY,
 key_secret: process.env.RAZORPAY_SECRET
});

router.post("/create-order", async (req,res)=>{
 const order = await razor.orders.create({
  amount: req.body.amount * 100,
  currency: "INR"
 });
 res.json(order);
});

module.exports = router;
