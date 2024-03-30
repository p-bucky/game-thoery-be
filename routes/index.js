const express = require("express");
const roomApi = require("./room");
const gameApi = require("./game")

function setupRoutes() {
  const router = express.Router();

  router.post("/room", roomApi.createRoom);
  router.post("/room/join", roomApi.joinRoom);

  router.get("/game", gameApi.getGame)


  return router;
}

module.exports = { setupRoutes };
