import verifyToken from "./verifyToken.mjs"

export default function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) return next()
    return res.status(403).json({ message: "Admin only" })
  })
}
