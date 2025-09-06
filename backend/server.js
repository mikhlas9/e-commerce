const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/cart');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://e-commerce-tau-rose.vercel.app',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  createSampleData();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Create sample data
async function createSampleData() {
  try {
    const Item = require('./models/Item');
    const itemCount = await Item.countDocuments();
    
    if (itemCount === 0) {
      console.log('🌱 Creating sample items...');
      
      const sampleItems = [
        {
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 199.99,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
          stock: 15
        },
        {
          name: 'Coffee Maker',
          description: 'Automatic drip coffee maker with programmable timer',
          price: 89.99,
          category: 'Home',
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
          stock: 8
        },
        {
          name: 'Running Shoes',
          description: 'Comfortable running shoes with excellent support',
          price: 129.99,
          category: 'Sports',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
          stock: 20
        },
        {
          name: 'Programming Book Set',
          description: 'Collection of bestselling programming books',
          price: 49.99,
          category: 'Books',
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
          stock: 12
        },
        {
          name: 'Skincare Set',
          description: 'Complete skincare routine with natural ingredients',
          price: 79.99,
          category: 'Beauty',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
          stock: 25
        },
        {
          name: 'Cotton T-Shirt',
          description: 'Comfortable cotton t-shirt in multiple colors',
          price: 29.99,
          category: 'Clothing',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
          stock: 50
        }
      ];
      
      await Item.insertMany(sampleItems);
      console.log('✅ Sample items created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
