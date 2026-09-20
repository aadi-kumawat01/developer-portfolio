import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const authCookieName = "adminToken";
const authCookieAge = 7 * 24 * 60 * 60 * 1000;

function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: authCookieAge,
  };
}

function safeAdmin(admin) {
  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
  };
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select(
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
