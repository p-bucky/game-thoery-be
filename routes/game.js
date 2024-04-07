const { pg_client } = require("../db");
const { knex } = require("../db/query-builder");

exports.getGame = async (req, resp) => {
  try {
    let data = null;
    let roomCode = null;
    let personId = null;

    personId = req.session.authentication.person_id;
    roomCode = req.query.room;
    data = {};
    data.person_id = personId;

    const query2 = knex("opinions").select("*").toString();
    const opnionsQueryResult = await pg_client.query(query2);

    data.opinions = opnionsQueryResult.rows;

    if (roomCode) {
      const query = knex("rooms")
        .select(
          "rooms.code",
          "opinions.description as opinion",
          "rooms.player_one",
          "rooms.player_two",
          "game.grid"
        )
        .where("room_code", roomCode)
        .andWhere(function () {
          this.where("player_one", personId).orWhere("player_two", personId);
        })
        .innerJoin("game", "game.room_code", "rooms.code")
        .innerJoin("opinions", "opinions.opinion_id", "rooms.opinion_id")
        .toString();

      const gameQueryResult = await pg_client.query(query);

      const p1 = gameQueryResult.rows[0].player_one;
      const p2 = gameQueryResult.rows[0].player_two;

      if (personId == p1) {
        data.opponent = p2;
      }

      if (personId == p2) {
        data.opponent = p1;
      }

      data = Object.assign({}, data, gameQueryResult.rows[0]);
    }

    resp.render("game", data);
  } catch (err) {
    console.log(err);
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};

exports.updateGrid = async (req, resp) => {
  try {
    req.body = JSON.parse(req.body);
    let decision = null;
    let grid = null;
    let personId = null;

    personId = req.session.authentication.person_id;
    decision = req.body.decision;
    code = req.body.code;

    const query = knex("game").select("*").where("room_code", code).toString();
    const result = await pg_client.query(query);
    if (result.rows[0].is_completed) {
      return resp
        .status(400)
        .json({
          code: "GAME_COMPLETED",
          message: "Game Already Completed",
          status: 400,
        });
    }

    grid = result?.rows?.[0]?.grid;

    let toUpdateIndex = 0;
    for (gridItem of grid) {
      if (gridItem.decisions[personId].decision) {
        toUpdateIndex = gridItem.id + 1;
      }
    }

    grid = grid.map((item, i) => {
      if (toUpdateIndex == i) {
        item.decisions[personId].decision = decision;
        return item;
      }
      return item;
    });

    const query2 = knex("game")
      .update("grid", JSON.stringify(grid))
      .where("room_code", code)
      .returning("*")
      .toString();
    const result2 = await pg_client.query(query2);

    /**
     * check if game completed
     */
    const gridAttemped = result2?.rows?.[0]?.grid.map((item) => {
      const players = Object.keys(item.decisions);
      if (
        item.decisions[players[0]].decision &&
        item.decisions[players[1]].decision
      ) {
        return true;
      }
      return false;
    });

    if (!gridAttemped.includes(false)) {
      const query = knex("game")
        .update("is_completed", true)
        .where("room_code", code)
        .returning("*")
        .toString();
      await pg_client.query(query);
    }

    resp.json(result2?.rows?.[0]?.grid);
  } catch (err) {
    console.log(err);
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};
