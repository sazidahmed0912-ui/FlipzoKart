require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// ------------------ MONGODB ------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", UserSchema);

// ------------------ ORDER MODEL ------------------
const OrderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  total: Number,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);

// ------------------ AUTH ROUTES ------------------
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash });
    await user.save();
    res.json({ user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/api/auth/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

// ------------------ ROUTES ------------------
app.get("/", (req, res) => {
  res.send("Flipzokart server running...");
});

// Checkout
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { cart } = req.body;

    const lineItems = cart.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel"
    });

    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// Payment Success Webhook
app.post("/api/checkout-success", async (req, res) => {
  try {
    const { session } = req.body;

    const items = session.line_items.data.map(li => ({
      productId: li.price.product,
      name: li.description,
      price: li.price.unit_amount / 100,
      quantity: li.quantity
    }));

    const total = session.amount_total / 100;

    const order = new Order({
      userId: session.customer_email || "guest",
      items,
      total,
      status: "paid"
    });

    await order.save();

    res.json({ message: "Order saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Order save failed" });
  }
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
