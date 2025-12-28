const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/payment", require("./routes/payment"));

app.get("/", (req,res)=>{
 res.send("FlipzoKart API Running");
});

app.listen(process.env.PORT || 5000, ()=>{
 console.log("Server started on port " + (process.env.PORT || 5000));
});

