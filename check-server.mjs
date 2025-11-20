import http from "http"

const host = "localhost"
const port = process.env.PORT || 5000

const req = http.request(
  { host, port, path: "/api/products?limit=1", timeout: 2000 },
  res => {
    if (res.statusCode === 200) process.exit(0)
    process.exit(1)
  }
)

req.on("error", () => process.exit(1))
req.end()
