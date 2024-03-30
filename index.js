require("dotenv").config();
const express = require("express");
const { setupRoutes } = require("./routes");
const { runSeeding } = require("./db/seeding");
const PORT = process.env.PORT || 3000;

const app = express();
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
