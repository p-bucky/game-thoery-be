const express = require("express");
const roomApi = require("./room");

function setupRoutes() {
  const router = express.Router();

  router.post("/room", roomApi.createRoom);
  router.post("/room/join", roomApi.joinRoom);


  return router;
}

module.exports = { setupRoutes };
