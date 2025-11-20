import express from "express"
import User from "../models/User.mjs"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const router = express.Router()

const sign = user =>
  jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "7d" }
  )

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password || password.length < 3)
      return res.status(400).json({ message: "Invalid data" })

    const exist = await User.findOne({ email })
    if (exist) return res.status(400).json({ message: "User exists" })

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hash })

    const token = sign(user)

    res.json({
      token,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: "Invalid data" })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: "No user" })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: "Wrong pass" })

    const token = sign(user)

    res.json({
      token,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
