const { pg_client } = require("../db");
const { knex } = require("../db/query-builder");

exports.getGame = async (req, resp) => {
  try {
    let data = null;
    let roomCode = null;
    let personId = null;

    personId = req.session.authentication.person_id;
    roomCode = req.query.room;

    const query2 = knex("opinions").select("*").toString();
    const opnionsQueryResult = await pg_client.query(query2);

    const query = knex("rooms")
      .select(
        "rooms.code",
        "opinions.description as opinion",
        "rooms.player_one",
        "rooms.player_two",
        "game.grid",
        "game.grid_length"
      )
      .where("player_one", personId)
      .where("room_code", roomCode)
      .orWhere("player_two", personId)
      .innerJoin("game", "game.room_code", "rooms.code")
      .innerJoin("opinions", "opinions.opinion_id", "rooms.opinion_id")
      .toString();

    const gameQueryResult = await pg_client.query(query);

    data = {
      ...(gameQueryResult.rows[0] || {}),
      opinions: opnionsQueryResult.rows,
      person_id: personId
    };

    console.log(data)
    resp.render("game", data);

  } catch (err) {
    console.log(err);
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};
