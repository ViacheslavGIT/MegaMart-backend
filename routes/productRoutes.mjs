import express from "express"
import Product from "../models/Product.mjs"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find().sort({ _id: -1 }).skip(skip).limit(limit),
      Product.countDocuments()
    ])

    res.json({ products, total })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/filter", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit

    const { category, brand, sort, order } = req.query

    const query = {}
    if (typeof category === "string" && category.trim()) {
      query.category = new RegExp(`^${category}$`, "i")
    }
    if (typeof brand === "string" && brand.trim()) {
      query.brand = new RegExp(`^${brand}$`, "i")
    }

    const sortObj = {}
    if (sort) {
      sortObj[sort] = order === "desc" ? -1 : 1
    } else {
      sortObj._id = -1
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .select("_id name brand category price off img")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ])

    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch {
    res.status(500).json({ message: "Error filtering products" })
  }
})

router.get("/random", async (req, res) => {
  try {
    const r = await Product.aggregate([{ $sample: { size: 1 } }])
    res.json(r[0] || {})
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
