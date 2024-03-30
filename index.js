require("dotenv").config();
const express = require("express");
const { resolve, dirname } = require("node:path");
const { setupRoutes } = require("./routes");
const { runSeeding } = require("./db/seeding");
const cors = require("cors")

const PORT = process.env.PORT || 3000;

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

app.use("/api", setupRoutes());

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
