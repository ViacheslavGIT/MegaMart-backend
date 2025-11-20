import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.mjs';
import Order from '../models/Order.mjs';
import Product from '../models/Product.mjs';
import verifyUser from '../middleware/verifyUser.mjs';

const router = express.Router();

router.get('/info', verifyUser, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
  });
});

router.get('/favorites', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      model: 'Product',
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.favorites || []);
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ message: 'Error loading favorites' });
  }
});

router.post('/favorites/:productId', verifyUser, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: 'Invalid product ID' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.favorites.findIndex((id) => id.toString() === productId);

    if (index >= 0) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(productId);
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id).populate({
      path: 'favorites',
      model: 'Product',
    });

    res.json(updatedUser.favorites);
  } catch (error) {
    console.error('Update favorites error:', error);
    res.status(500).json({ message: 'Error updating favorites' });
  }
});

router.get('/orders', verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Error loading orders' });
  }
});

export default router;
