import "dotenv/config";
import app from "./src/app.js";
import { ensureInitialAdmin } from "./src/config/admin.js";
import connectDB from "./src/config/db.js";

async function startServer() {
  try {
    await connectDB();
    await ensureInitialAdmin();

    const port = process.env.PORT || 5000;

    const server = app.listen(port, () => {
      console.log(`Portfolio backend running on port ${port}`);
    });

    server.on("error", () => {
      console.error("Unable to start the portfolio backend.");
      process.exit(1);
    });
  } catch (error) {
    console.error("Unable to start the portfolio backend.");
    process.exit(1);
  }
}

startServer();
