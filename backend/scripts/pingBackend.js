const healthUrl = process.env.BACKEND_HEALTH_URL;

if (!healthUrl) {
  console.error("BACKEND_HEALTH_URL is required.");
  process.exitCode = 1;
} else {
  try {
    const url = new URL(healthUrl);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Health URL must use http or https.");
    const response = await fetch(url);
    console.log(`${new Date().toISOString()} health ${response.status}`);
    if (!response.ok) process.exitCode = 1;
  } catch (error) {
    console.error(`${new Date().toISOString()} health check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
