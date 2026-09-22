import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import AboutHighlight from "../models/AboutHighlight.js";
import Education from "../models/Education.js";
import Learning from "../models/Learning.js";
import Project from "../models/Project.js";
import ProjectCategory from "../models/ProjectCategory.js";
import SiteContent from "../models/SiteContent.js";
import Skill from "../models/Skill.js";
import SkillCategory from "../models/SkillCategory.js";
import SocialLink from "../models/SocialLink.js";

const siteContent = {
  hero: {
    eyebrow: "DESIGN • DEVELOP • DELIVER",
    firstName: "Aditya",
    lastName: "Kumawat",
    role: "Full Stack Web Developer",
    description: "I build fast, responsive web experiences with clean interfaces, smooth interactions and practical functionality.",
    primaryCta: { label: "View My Work", href: "/#projects" },
    secondaryCta: { label: "Let's Talk", href: "/#contact" },
    visible: true,
  },
  about: {
    eyebrow: "About Me",
    heading: "Building websites that feel clean, fast and modern.",
    description: "I’m a full stack web developer focused on building modern web experiences with clean interfaces, responsive layouts, smooth interactions and practical functionality.",
    developerLabel: "Full Stack Web Developer",
    locationText: "Jaipur",
    imageUrl: "/images/profile/aditya-profile.png",
    imagePublicId: "",
    visible: true,
  },
  contact: {
    eyebrow: "Contact",
    heading: "",
    description: "Have an idea, project or opportunity in mind? Send me a message and let's talk about it.",
    availabilityText: "",
    email: "aadityakumawat6165@gmail.com",
    location: "Jaipur, Rajasthan, India",
    formHeading: "Tell me about your project.",
    formDescription: "",
    visible: true,
  },
};

const aboutHighlights = [
  "Responsive Website Design",
  "Full Stack Developer",
  "API Integration",
  "Clean UI Components",
];

const educationRecords = [
  {
    type: "Secondary Education",
    title: "Class 10th",
    institution: "Bright Senior Secondary School, Sikar",
    board: "RBSE",
    yearLabel: "2022",
    percentage: "79%",
    description: "Completed my secondary education with a strong academic foundation and consistent performance across core subjects.",
    status: "completed",
    order: 1,
    visible: true,
  },
  {
    type: "Higher Secondary Education",
    title: "Class 12th — Science (Mathematics)",
    institution: "Bright Senior Secondary School, Sikar",
    board: "RBSE",
    yearLabel: "2024",
    percentage: "90.60%",
    description: "Completed higher secondary education in the Science stream with Mathematics, achieving a strong academic score and improving analytical thinking.",
    status: "completed",
    order: 2,
    visible: true,
  },
  {
    type: "Undergraduate",
    title: "Bachelor of Arts (B.A.)",
    college: "Govt Arts College, Sikar",
    university: "Pandit Deendayal Upadhyaya Shekhawati University, Sikar",
    startDate: "2025",
    endDate: "2028",
    yearLabel: "Currently in 2nd Year",
    marksLabel: "2nd Year",
    description: "Currently pursuing a Bachelor's degree in Arts while learning web development independently and gaining practical experience by building real projects.",
    status: "ongoing",
    order: 3,
    visible: true,
  },
];

const skillCategories = [
  { name: "Frontend", slug: "frontend", order: 1, visible: true },
  { name: "Backend", slug: "backend", order: 2, visible: true },
  { name: "Database", slug: "database", order: 3, visible: true },
  { name: "Tools & Others", slug: "tools", order: 4, visible: true },
];

const skills = [
  ["HTML", "frontend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", 1],
  ["CSS", "frontend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", 2],
  ["JavaScript", "frontend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", 3],
  ["React.js", "frontend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", 4],
  ["Next.js", "frontend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", 5],
  ["Tailwind CSS", "frontend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", 6],
  ["Bootstrap", "frontend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg", 7],
  ["Node.js", "backend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", 1],
  ["Express.js", "backend", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", 2],
  ["MongoDB", "database", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg", 1],
  ["Git", "tools", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", 1],
];

const projectCategories = [
  { name: "E-Commerce / Full Stack", slug: "fullstack", order: 1, visible: true },
  { name: "Portfolio / Frontend", slug: "frontend", order: 2, visible: true },
];

const projects = [
  {
    title: "Nestro E-Commerce",
    slug: "nestro",
    categorySlug: "fullstack",
    shortDescription: "A modern full-stack e-commerce platform focused on a clean shopping experience, responsive interface and practical store management.",
    description: "Nestro is a full-stack e-commerce experience built around a smooth furniture-shopping flow. It brings product discovery, cart and wishlist actions, checkout, and order-related screens into one responsive interface. The project also includes store-management controls for categories, rooms, products, stock and orders, keeping the customer and admin workflows clearly separated.",
    techStack: ["Next.js", "Express.js", "Tailwind CSS", "Node.js", "MongoDB"],
    thumbnailUrl: "/images/projects/nestro.jpg",
    screenshots: [],
    liveUrl: "https://nestro-one.vercel.app/",
    githubUrl: "https://github.com/aadi-kumawat01/nestro",
    status: "live",
    featured: true,
    featuredOrder: 1,
    order: 1,
    visible: true,
  },
  {
    title: "Cafe Management System",
    slug: "cafe-management-system",
    categorySlug: "fullstack",
    shortDescription: "A full-stack cafe management application with role-based access for Admin, Waiter and Kitchen/Cook.",
    description: "A full-stack cafe management application with role-based access for Admin, Waiter and Kitchen/Cook.",
    techStack: ["Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    thumbnailUrl: "",
    screenshots: [],
    liveUrl: "",
    githubUrl: "",
    status: "development",
    featured: true,
    featuredOrder: 2,
    order: 2,
    visible: true,
  },
  {
    title: "Developer Portfolio",
    slug: "developer-portfolio",
    categorySlug: "frontend",
    shortDescription: "A modern responsive portfolio website built to showcase my skills, projects and development journey with a clean and interactive user experience.",
    description: "This portfolio presents my development work in a focused, responsive experience. It brings together the sections that explain who I am, what I am learning and the projects I am building. The interface uses the same dark visual system across desktop, tablet and phone layouts, with navigation and project pages designed to keep the content easy to explore.",
    techStack: ["Next.js", "React.js", "Tailwind CSS"],
    thumbnailUrl: "/images/projects/portfolio.jpg",
    screenshots: [],
    liveUrl: "",
    githubUrl: "",
    status: "live",
    featured: true,
    featuredOrder: 3,
    order: 3,
    visible: true,
  },
];

const socialLinks = [
  { label: "GitHub", url: "https://github.com/aadi-kumawat01", iconKey: "github", order: 1, visible: true },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/aditya-kumawat-b936ab31a", iconKey: "linkedin", order: 2, visible: true },
];

async function upsertPortfolioData() {
  await SiteContent.findOneAndUpdate(
    { singletonKey: "site" },
    { $set: siteContent, $setOnInsert: { singletonKey: "site" } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  for (const [index, title] of aboutHighlights.entries()) {
    await AboutHighlight.findOneAndUpdate(
      { title },
      { $set: { title, order: index + 1, visible: true } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }

  for (const record of educationRecords) {
    await Education.findOneAndUpdate(
      { title: record.title },
      { $set: record },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }

  const categoryBySlug = new Map();
  for (const category of skillCategories) {
    const savedCategory = await SkillCategory.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    categoryBySlug.set(category.slug, savedCategory);
  }

  for (const [name, categorySlug, iconUrl, order] of skills) {
    await Skill.findOneAndUpdate(
      { name, category: categoryBySlug.get(categorySlug)._id },
      {
        $set: {
          name,
          category: categoryBySlug.get(categorySlug)._id,
          iconUrl,
          proficiency: null,
          order,
          visible: true,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }

  const projectCategoryBySlug = new Map();
  for (const category of projectCategories) {
    const savedCategory = await ProjectCategory.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    projectCategoryBySlug.set(category.slug, savedCategory);
  }

  const occupiedFeaturedOrders = await Project.find({
    featured: true,
    slug: { $nin: projects.map((project) => project.slug) },
  }).select("title slug featuredOrder");

  if (occupiedFeaturedOrders.length) {
    throw new Error("Featured positions are already used by unrelated projects. Move them in Admin before running this seed.");
  }

  for (const project of projects) {
    const { categorySlug, ...projectData } = project;
    await Project.findOneAndUpdate(
      { slug: project.slug },
      {
        $set: {
          ...projectData,
          category: projectCategoryBySlug.get(categorySlug)._id,
          thumbnailPublicId: "",
          screenshotPublicIds: [],
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
    );
  }

  for (const link of socialLinks) {
    await SocialLink.findOneAndUpdate(
      { url: link.url },
      { $set: link },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }
}

async function run() {
  await connectDB();
  console.log(`Connected to portfolio database: ${mongoose.connection.name}`);
  await upsertPortfolioData();
  console.log("Site content: updated");
  console.log("About stats: skipped (no confirmed factual stats)");
  console.log(`About highlights: ${aboutHighlights.length} records`);
  console.log(`Education: ${educationRecords.length} records`);
  console.log(`Learning: ${await Learning.countDocuments()} existing records preserved (no public learning data seeded)`);
  console.log(`Skill categories: ${skillCategories.length} records`);
  console.log(`Skills: ${skills.length} records`);
  console.log(`Project categories: ${projectCategories.length} records`);
  console.log(`Projects: ${projects.length} records`);
  console.log("Testimonials: skipped (no genuine data seeded)");
  console.log(`Social links: ${socialLinks.length} records`);
}

run()
  .catch((error) => {
    console.error("Portfolio seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
