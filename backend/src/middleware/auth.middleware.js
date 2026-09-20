import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function requireAdmin(req, res, next) {
  const token = req.cookies.adminToken;

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const { adminId } = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
}
