import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    brand: { type: String, required: true, trim: true, maxlength: 100, index: true },
    category: { type: String, required: true, trim: true, maxlength: 100, index: true },
    price: { type: Number, required: true, min: 1, max: 999999 },
    off: { type: Number, default: 0, min: 0, max: 90 },
    img: { type: String, required: true },
    desc: { type: String, default: "" }
  },
  { timestamps: true }
)

export default mongoose.model("Product", productSchema)
