import express from "express"
import Order from "../models/Order.mjs"

const router = express.Router()

// GET - защищенный (только для авторизованных)
router.get("/", async (req, res) => {
  try {
    // Для GET можно оставить проверку авторизации через заголовки
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: "No token" })
    }

    // Декодируем токен чтобы получить user id
    const token = authHeader.split(" ")[1]
    const jwt = await import("jsonwebtoken")
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey")
    
    const orders = await Order.find({ user: decoded.id })
      .sort({ _id: -1 })
      .limit(200)
    res.json(orders)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

// POST - публичный (без проверки токена)
router.post("/", async (req, res) => {
  try {
    const { products, total, name, phone, email, country, city, address } = req.body

    if (!products || !Array.isArray(products) || products.length === 0)
      return res.status(400).json({ message: "Invalid items" })

    if (!total || typeof total !== "number" || total <= 0)
      return res.status(400).json({ message: "Invalid total" })

    if (!name || !phone || !email || !country || !city || !address) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const items = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      img: p.img || ""
    }))

    const order = await Order.create({
      user: null,
      items,
      total,
      name,
      phone,
      email,
      country,
      city,
      address
    })

    res.json(order)
  } catch (err) {
    console.log("ORDER ERROR", err)
    res.status(500).json({ message: "Server error" })
  }
})

export default router