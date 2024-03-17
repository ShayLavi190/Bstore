// Importing required modules
const mongoose = require('mongoose'); // MongoDB object modeling tool
const bodyParser = require('body-parser'); // Parse incoming request bodies
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const express = require('express'); // Fast, unopinionated, minimalist web framework for Node.js

const app = express(); // Create an instance of the express application

app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB database
mongoose.connect('mongodb+srv://shayla:Ahkcht98@users.6sxopkc.mongodb.net/storedatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define user schema
const userSchema = new mongoose.Schema({
    full_name: String,
    email: String,
    address: {
      street: String,
      city: String,
      number: String,
      zipcode: String,
      country: String
    },
    password: String
});

// Create User model
const User = mongoose.model('User', userSchema, 'users');

// Define product schema
const productSchema = new mongoose.Schema({
  name: String,
  currency: String,
  price: Number,
  istopseller: Boolean,
  category: String,
  link: String,
  notify: Array,
  index: String,
  prod_id: String,
  quntity: Number,
  image: String,
  isInStock: Boolean
});

// Create Product model
const Product = mongoose.model('Product', productSchema, 'products');

// Handle login request
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email, password });
      if (user) {
        res.json({ success: true, message: 'Credentials found' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error checking credentials:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Handle user registration request
app.post('/register', async (req, res) => {
    const userData = req.body;
    try {
      console.log('userData:', userData);
      const newUser = new User(userData);
      await newUser.save();
      res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get top seller products
app.get('/products/top-sellers', async (req, res) => {
  try {
    const products = await Product.find({ istopseller: true });
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error getting top seller products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get products by category
app.get('/products/:category', async (req, res) => {
  const category = req.params.category; 
  try {
    const products = await Product.find({ category });
    res.json({ success: true, products });
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// put the product by id with the changes
app.put('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProductData = req.body;
    const updatedProduct = await Product.findOneAndUpdate({prod_id:productId}, updatedProductData, { new: true });
    res.json(updatedProduct); 
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by category and index
app.get('/:category/:index', async (req, res) => {
  try {
    const index = req.params.index;
    const category = req.params.category;
    const products = await Product.find({ category });
    const product = products[index];
    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// order schema
const orderSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: Number,
  ispaid: Boolean,
  address: {
    street: String,
    city: String,
    number: String,
    apt: String,
    country: String
  },
  creditCard: String,
  ValidDate: String,
  cvv: String, 
  items: Array 
});

const Order = mongoose.model('Order', orderSchema, 'orders');

const CryptoJS = require('crypto-js');

// Handle order request
app.post('/order', async (req, res) => {
  try {
    // Extract user data from the request body
    const { name, id, phone, email, ispaid, address, creditCard, ValidDate, cvv, items } = req.body;
    // Encrypt credit card number and CVV using AES
    const encryptionKey = 'Admin2712#'; 
    const encryptedCreditCard = CryptoJS.AES.encrypt(creditCard, encryptionKey).toString();
    const encryptedCVV = CryptoJS.AES.encrypt(cvv, encryptionKey).toString();
    // Create a new order instance with encrypted credit card number and CVV
    const newOrder = new Order({
      name,
      id,
      phone,
      email,
      ispaid, 
      address,
      creditCard: encryptedCreditCard,
      ValidDate,
      cvv: encryptedCVV,
      items
    });
    // Save the new order to the database
    await newOrder.save();
    // Respond with success message
    res.status(201).json({ success: true, message: 'Order inserted successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error inserting order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const { email } = req.query;
    const orders = await Order.find({ email });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user information
app.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Endpoint to update user information
app.put('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const updatedUserData = req.body;
    const updatedUser = await User.findOneAndUpdate({ email }, updatedUserData, { new: true });
    console.log('Updated user:', updatedUser);
    console.log('updatedUserData : ',updatedUserData);
    if (updatedUser) {
      res.status(200).json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start the server
const PORT = 6500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
