import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const assetsFolder = path.join(__dirname, "../../public/assets/");
const outputFile = path.join(__dirname, "../data/products.mjs");

if (!fs.existsSync(assetsFolder)) {
  fs.mkdirSync(assetsFolder, { recursive: true });
}

const categories = {
  Smartphones: [
    "iPhone 15 Pro",
    "Samsung Galaxy S24 Ultra",
    "Google Pixel 8 Pro",
    "OnePlus 12",
    "Xiaomi 14 Pro",
    "Sony Xperia 1 V",
    "ASUS ROG Phone 8",
    "Huawei P60 Pro",
    "Nothing Phone 2",
    "Motorola Edge 40 Pro"
  ],

  Laptops: [
    "MacBook Pro 16 M3",
    "Dell XPS 15",
    "HP Spectre x360",
    "Lenovo ThinkPad X1 Carbon",
    "ASUS ZenBook 14",
    "Acer Swift 5",
    "Razer Blade 16",
    "MSI Stealth 14",
    "Gigabyte Aero 16",
    "Samsung Galaxy Book 3"
  ],

  Headphones: [
    "AirPods Pro 2",
    "Sony WH-1000XM5",
    "Beats Studio Pro",
    "Bose QuietComfort 45",
    "Marshall Monitor II",
    "Sennheiser Momentum 4",
    "JBL Tour One M2",
    "Anker Soundcore Q45",
    "Shure AONIC 50",
    "Bowers & Wilkins PX8"
  ],

  Watches: [
    "Apple Watch Ultra 2",
    "Samsung Galaxy Watch 6",
    "Garmin Fenix 7",
    "Huawei Watch GT4",
    "Amazfit Balance",
    "Fitbit Sense 2",
    "Polar Vantage V3",
    "Suunto 9 Peak Pro",
    "Fossil Gen 6",
    "TicWatch Pro 5"
  ]
};

function toFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + ".jpg";
}

function autoPrice(category) {
  switch (category) {
    case "Smartphones": return Math.floor(799 + Math.random() * 600);
    case "Laptops": return Math.floor(1299 + Math.random() * 2000);
    case "Headphones": return Math.floor(149 + Math.random() * 450);
    case "Watches": return Math.floor(249 + Math.random() * 500);
    default: return 99;
  }
}


function autoDiscount() {
  return [5, 7, 10, 12, 15][Math.floor(Math.random() * 5)];
}

function autoDescription(name, category, brand, price) {
  return `${name} — преміальний продукт від ${brand}. Категорія: ${category}. 
Створений для тих, хто цінує якість, продуктивність та надійність. 
Ідеальний вибір за свою ціну ₴${price}.`;
}
const products = [];

for (const category in categories) {
  for (const name of categories[category]) {
    const brand = name.split(" ")[0];
    const price = autoPrice(category);
    const off = autoDiscount();
    const imgFile = toFileName(name);

    const imgPath = path.join(assetsFolder, imgFile);

    if (!fs.existsSync(imgPath)) {
      fs.writeFileSync(imgPath, Buffer.from(`Image placeholder for ${name}`));
    }

    products.push({
      name,
      brand,
      category,
      price,
      off,
      img: `/assets/${imgFile}`,
      description: autoDescription(name, category, brand, price),
    });
  }
}
const content =
  "export const products = " +
  JSON.stringify(products, null, 2) +
  ";\nexport default products;";

fs.writeFileSync(outputFile, content);

console.log("====================================");
console.log("✅ Products successfully generated!");
console.log("📁 Assets: /public/assets/");
console.log("📄 File: /backend/data/products.mjs");
console.log("====================================");
