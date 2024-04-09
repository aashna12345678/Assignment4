const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://acchopra1234:achopra1234@cluster0.ixnnc1q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Product schema
const productSchema = new mongoose.Schema({
  description: String,
  image: String,
  price: Number,
  shipping_cost: Number,
});

const Product = mongoose.model("Product", productSchema);

// User schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  purchase_history: String, // Or you can use an array or another appropriate data type
  shipping_address: String,
});

const User = mongoose.model("User", userSchema);

// Cart Schema
const cartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const Cart = mongoose.model("Cart", cartSchema);

// Order schema
const orderSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: { type: Number, required: true },
  order_date: { type: Date, default: Date.now },
  order_id: { type: Number, required: true },
});

const Order = mongoose.model("Order", orderSchema);

// Comment schema
const commentSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: { type: Number, required: true },
  images: [String], // Array of image URLs
  comment: String,
});

const Comment = mongoose.model("Comment", commentSchema);

// Create a new product
app.post("/products", async (req, res) => {
  const { description, image, price, shipping_cost } = req.body;
  const product = new Product({
    description,
    image,
    price,
    shipping_cost,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
});

// Update a product
app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.description = req.body.description;
      product.image = req.body.image;
      product.price = req.body.price;
      product.shipping_cost = req.body.shipping_cost;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  const { email, password, username, purchase_history, shipping_address } =
    req.body;
  const user = new User({
    email,
    password,
    username,
    purchase_history,
    shipping_address,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
});

// Update a user
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.email = req.body.email;
      user.password = req.body.password;
      user.username = req.body.username;
      user.purchase_history = req.body.purchase_history;
      user.shipping_address = req.body.shipping_address;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//cart
// Get all carts
app.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cart by ID
app.get("/carts/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new cart
app.post("/carts", async (req, res) => {
  const cart = new Cart({
    product_id: req.body.product_id,
    user_id: req.body.user_id,
    quantity: req.body.quantity,
  });

  try {
    const newCart = await cart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a cart
app.put("/carts/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.product_id = req.body.product_id;
    cart.user_id = req.body.user_id;
    cart.quantity = req.body.quantity;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a cart
app.delete("/carts/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await cart.remove();
    res.json({ message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//order
// Create a new order
app.post("/orders", async (req, res) => {
  const { product_id, user_id, quantity, order_id } = req.body;
  const order = new Order({
    product_id,
    user_id,
    quantity,
    order_id,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
app.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an order
app.put("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.product_id = req.body.product_id;
    order.user_id = req.body.user_id;
    order.quantity = req.body.quantity;
    order.order_id = req.body.order_id;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an order
app.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.remove();
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//comments
// Create a new comment
app.post("/comments", async (req, res) => {
  const { product_id, user_id, rating, images, comment } = req.body;
  const newComment = new Comment({
    product_id,
    user_id,
    rating,
    images,
    comment,
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all comments
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comment by ID
app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a comment
app.put("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.product_id = req.body.product_id;
    comment.user_id = req.body.user_id;
    comment.rating = req.body.rating;
    comment.images = req.body.images;
    comment.comment = req.body.comment;

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a comment
app.delete("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.remove();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`App is listening at http://${host}:${port}/`);
});
