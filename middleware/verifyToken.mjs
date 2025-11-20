import jwt from "jsonwebtoken"

export default function verifyToken(req, res, next) {
  // ВРЕМЕННО ОТКЛЮЧАЕМ ВСЮ ПРОВЕРКУ ТОКЕНА
  return next();
  
  // Старый код (закомментирован):
  /*
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: "No token" })

  const token = header.split(" ")[1]

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" })
    req.user = decoded
    next()
  })
  */
}