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

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function getContactMessage(body) {
  const fields = ["name", "email", "subject", "message", "website"];

  for (const field of fields) {
    if (field in body && typeof body[field] !== "string") {
      return { error: `${field} must be a string` };
    }
  }

  const name = body.name?.trim() || "";
  const email = body.email?.trim().toLowerCase() || "";
  const subject = (body.subject?.trim() || "").replace(/[\r\n]+/g, " ");
  const message = body.message?.trim() || "";
  const website = body.website?.trim() || "";

  if (!name || name.length > 80) return { error: "Please enter a valid name." };
  if (!email || email.length > 254 || !isValidEmail(email)) return { error: "Please enter a valid email address." };
  if (subject.length > 150) return { error: "Subject must be 150 characters or fewer." };
  if (message.length < 2 || message.length > 5000) return { error: "Please enter a message between 2 and 5000 characters." };

  return { name, email, subject, message, website };
}

function createEmailHtml({ name, email, subject, message }) {
  const formattedMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const subjectRow = subject
    ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>`
    : "";

  return `
    <div style="font-family:Arial,sans-serif;color:#1f1720;line-height:1.6">
      <h2>New Portfolio Contact</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${subjectRow}
      <p><strong>Message:</strong></p>
      <p>${formattedMessage}</p>
      <hr style="border:0;border-top:1px solid #e5e1e4;margin:24px 0">
      <p style="color:#6f6470;font-size:12px">Sent from Aditya Kumawat's portfolio contact form.</p>
    </div>
  `;
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

export async function sendContactMessage(req, res) {
  const contactMessage = getContactMessage(req.body || {});

  if (contactMessage.error) {
    return res.status(400).json({ success: false, message: contactMessage.error });
  }

  if (contactMessage.website) {
    return res.json({ success: true, message: "Message sent successfully." });
  }

  const missingVariables = ["BREVO_API_KEY", "BREVO_SENDER_EMAIL", "CONTACT_RECEIVER_EMAIL"]
    .filter((variable) => !process.env[variable]);

  if (missingVariables.length) {
    console.error(`Contact email is missing configuration: ${missingVariables.join(", ")}`);
    return res.status(503).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }

  const subject = contactMessage.subject
    ? `Portfolio Contact — ${contactMessage.subject}`
    : `Portfolio Contact — New Message from ${contactMessage.name}`;

  try {
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME || "Aditya Portfolio",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: process.env.CONTACT_RECEIVER_EMAIL }],
        replyTo: { email: contactMessage.email, name: contactMessage.name },
        subject,
        htmlContent: createEmailHtml(contactMessage),
      }),
    });

    if (!brevoResponse.ok) {
      console.error(`Brevo contact email failed with status ${brevoResponse.status}`);
      return res.status(502).json({
        success: false,
        message: "Unable to send your message right now. Please try again later.",
      });
    }

    return res.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Brevo contact email request failed.");
    return res.status(502).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
}
