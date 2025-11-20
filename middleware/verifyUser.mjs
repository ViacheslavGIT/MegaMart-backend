import verifyToken from "./verifyToken.mjs"

export default function verifyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin === false) {
      return next()
    }
    return res.status(403).json({ message: "User only" })
  })
}
