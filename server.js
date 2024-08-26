const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/productModels");

const app = express();

app.use(express.json()); // Corrected here by adding parentheses
//routes
app.use(
  cors({
    origin: "http://localhost:3001", // Allow your frontend origin
  })
);

app.get("/", (req, res) => {
  res.send("Hello NODE API");
});
app.get("/blog", (req, res) => {
  res.send("Hello Blog, my name is Gabi");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//update a product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    //we can not find any product with the id in the database
    if (!product) {
      return res
        .status(404)
        .json({ message: `We can not find find product${id}` });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };
    await Product.insertMany([data]);
    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
// email-check
app.get("/check-email", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await Product.findOne({ email: email });
    if (user) {
      return res.json({ emailExists: true });
    } else {
      return res.json({ emailExists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

//login
app.post("/login", async (req, res) => {
  // console.log("Login Request Body:", req.body); // Add this line
  try {
    const check = await Product.findOne({ email: req.body.email });

    if (!check) {
      return res.status(401).json({ message: "User not found" });
    }

    if (check.password === req.body.password) {
      return res.status(200).json({ message: "Login Successful", user: check });
    } else {
      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `can not find any product with ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://admin:Amina123@cluster0.wtrkiqe.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("connected to mongodb");
      console.log("Node API is running on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
