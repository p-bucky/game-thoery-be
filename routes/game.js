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
