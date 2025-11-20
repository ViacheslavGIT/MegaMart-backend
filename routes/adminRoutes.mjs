import express from "express"
import Product from "../models/Product.mjs"
import Order from "../models/Order.mjs"
import verifyAdmin from "../middleware/verifyAdmin.mjs"

const router = express.Router()

router.get("/products", verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 })
    res.json(products)
  } catch {
    res.status(500).json({ message: "Error loading products" })
  }
})

router.post("/products", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.json(product)
  } catch {
    res.status(500).json({ message: "Error creating product" })
  }
})

router.put("/products/:id", verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body)
    res.json({ success: true })
  } catch {
    res.status(500).json({ message: "Error updating product" })
  }
})

router.delete("/products/:id", verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ message: "Error deleting product" })
  }
})

router.get("/orders", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(500).lean()
    res.json(orders)
  } catch {
    res.status(500).json({ message: "Error loading orders" })
  }
})

router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalRevenue = (
      await Order.find()
    ).reduce((sum, o) => sum + o.total, 0)

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue
    })
  } catch {
    res.status(500).json({ message: "Error loading stats" })
  }
})

export default router
