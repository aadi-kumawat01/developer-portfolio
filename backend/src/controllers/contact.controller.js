import SiteContent from "../models/SiteContent.js";

const emptyContact = {
  eyebrow: "",
  heading: "",
  description: "",
  availabilityText: "",
  email: "",
  location: "",
  formHeading: "",
  formDescription: "",
  visible: true,
};
const textFields = [
  "eyebrow",
  "heading",
  "description",
  "availabilityText",
  "email",
  "location",
  "formHeading",
  "formDescription",
];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getContactUpdates(body) {
  const updates = {};

  for (const field of Object.keys(body)) {
    if (![...textFields, "visible"].includes(field)) {
      return { error: `${field} is not supported` };
    }
  }

  for (const field of textFields) {
    if (field in body) {
      if (typeof body[field] !== "string") {
        return { error: `${field} must be a string` };
      }

      const value = body[field].trim();

      if (field === "email" && value && !isValidEmail(value)) {
        return { error: "email must be valid" };
      }

      updates[`contact.${field}`] = value;
    }
  }

  if ("visible" in body) {
    if (typeof body.visible !== "boolean") {
      return { error: "visible must be a boolean" };
    }

    updates["contact.visible"] = body.visible;
  }

  if (!Object.keys(updates).length) {
    return { error: "No valid contact fields provided" };
  }

  return { updates };
}

export async function getPublicContact(req, res) {
  const content = await SiteContent.findOne({ singletonKey: "site" }).select("contact");

  res.json({ success: true, data: content?.contact || emptyContact });
}

export async function getAdminContact(req, res) {
  const content = await SiteContent.findOne({ singletonKey: "site" }).select("contact");

  res.json({ success: true, data: content?.contact || emptyContact });
}

export async function updateAdminContact(req, res) {
  const { updates, error } = getContactUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const content = await SiteContent.findOneAndUpdate(
    { singletonKey: "site" },
    { $set: updates, $setOnInsert: { singletonKey: "site" } },
    { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true },
  );

  return res.json({
    success: true,
    message: "Contact content updated",
    data: content.contact,
  });
}
