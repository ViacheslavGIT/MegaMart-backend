import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "./models/Product.mjs"

dotenv.config()

const MONGO = process.env.MONGO_URI

const data = [
  {
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    price: 1199,
    off: 10,
    img: "https://i.imgur.com/7YcXk9F.png",
    desc: "Flagship performance."
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    price: 1099,
    off: 12,
    img: "https://i.imgur.com/Lf4K7G5.png",
    desc: "Premium Android flagship."
  },
  {
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Laptops",
    price: 1499,
    off: 8,
    img: "https://i.imgur.com/1c6Y0pJ.png",
    desc: "Lightweight and powerful."
  },
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    price: 399,
    off: 15,
    img: "https://i.imgur.com/25P5X0k.png",
    desc: "Noise cancelling headphones."
  },
  {
    name: "Apple Watch Series 9",
    brand: "Apple",
    category: "Watches",
    price: 499,
    off: 10,
    img: "https://i.imgur.com/nW7S7hS.png",
    desc: "Smartwatch with OLED display."
  }
]

async function run() {
  await mongoose.connect(MONGO)
  await Product.deleteMany()
  await Product.insertMany(data)
  console.log("Imported")
  process.exit(0)
}

run()
