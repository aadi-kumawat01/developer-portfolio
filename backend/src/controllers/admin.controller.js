import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { authCookieName, authCookieOptions } from "../config/authCookie.js";

function safeAdmin(admin) {
  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
  };
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
  if (!normalizedEmail || typeof password !== "string") {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email: normalizedEmail }).select(
    "+password",
  );
  const passwordMatches = admin && (await admin.comparePassword(password));

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not configured");
  }

  const token = jwt.sign(
    { adminId: admin._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie(authCookieName, token, authCookieOptions()).json({
    success: true,
    message: "Login successful",
    data: safeAdmin(admin),
  });
}

export function logout(req, res) {
  const { maxAge, ...cookieOptions } = authCookieOptions();

  res.clearCookie(authCookieName, cookieOptions).json({
    success: true,
    message: "Logout successful",
  });
}

export function getCurrentAdmin(req, res) {
  res.json({
    success: true,
    data: safeAdmin(req.admin),
  });
}
