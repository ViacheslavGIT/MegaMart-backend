import mongoose from "mongoose"
import Product from "./models/Product.mjs"

export async function smartAssistantReply(text) {
  if (mongoose.connection.readyState !== 1)
    return "⚠️ Database is temporarily unavailable. Please try again later."

  const q = text.toLowerCase()

  const list = (title, items) =>
    `${title}\n` +
    items.map(p => `• ${p.name} — ₴${p.price.toLocaleString()} (-${p.off}%)`).join("\n") +
    "\nWould you like more details or to add one to cart?"

  if (/(phone|smartphone|iphone|samsung|xiaomi|pixel|oneplus)/.test(q)) {
    const items = await Product.find({ category: /smartphone|phone/i }).limit(3)
    return items.length ? list("📱 Here are some smartphones:", items) : "📦 No smartphones available."
  }

  if (/(laptop|macbook|dell|hp|asus|lenovo)/.test(q)) {
    const items = await Product.find({ category: /laptop/i }).limit(3)
    return items.length ? list("💻 Laptops currently in stock:", items) : "💻 No laptops available."
  }

  if (/(watch|garmin|apple watch|samsung watch)/.test(q)) {
    const items = await Product.find({ category: /watch/i }).limit(3)
    return items.length ? list("⌚ Watches you may like:", items) : "⌚ No watches available."
  }

  if (/(headphone|earbuds|sony|bose|jbl|airpods)/.test(q)) {
    const items = await Product.find({ category: /head/i }).limit(3)
    return items.length ? list("🎧 Available headphones:", items) : "🎧 No headphones available."
  }

  if (/(login|register|account|signin|signup)/.test(q))
    return "👤 You can sign in or create an account from the 'Account' section."

  if (/(buy|order|checkout|purchase)/.test(q))
    return "🛍 To place an order, open your cart and tap 'Place an order'."

  if (/(hello|hi|hey|greetings)/.test(q))
    return "👋 Hi! I'm your MegaMart Assistant. I can help you find deals and products."

  return "🤖 I’m not sure how to help yet. Try: 'Samsung phones', 'laptops', or 'show headphones'."
}
