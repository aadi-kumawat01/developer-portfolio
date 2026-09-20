import Admin from "../models/Admin.js";

export async function ensureInitialAdmin() {
  const adminExists = await Admin.exists({});

  if (adminExists) {
    return;
  }

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn("Initial admin credentials are not configured.");
    return;
  }

  await Admin.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  console.log("Initial admin created.");
}
