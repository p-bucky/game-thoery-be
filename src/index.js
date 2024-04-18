require("dotenv").config();
const express = require("express");
const { resolve } = require("node:path");
const { setupRoutes } = require("./routes");
const { runSeeding } = require("./db/seeding");
const cors = require("cors");
const setupSession = require("./session");
const { sessionHandler } = require("./session-handler");

const PORT = process.env.PORT || 3000;

(async () => {
  const app = express();

  const VIEWS_DIR = resolve(__dirname, "./views");
  const ASSETS_DIR = resolve(__dirname, "./assets");

  app.set("view engine", "pug");
  app.set("views", VIEWS_DIR);

  app.use("/gametheory/static", express.static(ASSETS_DIR));

  app.use(cors());
  app.use(express.text());
  app.use(express.json());

  // runSeeding()

  await setupSession(app);
  app.use(sessionHandler);

  app.use("/app", setupRoutes());

  app.get("/ping", (req, res) => {
    res.send("PONG");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
