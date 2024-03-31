const { pg_client } = require("../db");
const { knex } = require("../db/query-builder");
const { generateHex } = require("../utils/random-hex");

exports.createRoom = async (req, resp) => {
  try {
    let personId = null;
    let opinionId = null;
    req.body = JSON.parse(req.body);
    personId = req.session.authentication.person_id;
    opinionId = req.body.opinion_id;

    const query = knex("rooms")
      .insert({
        person_id: personId,
        opinion_id: opinionId,
        player_one: personId,
        code: generateHex(),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*")
      .toString();

    const result = await pg_client.query(query);
    resp.status(200).json({ data: result.rows[0], status: 200 });
  } catch (err) {
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};

exports.joinRoom = async (req, resp) => {
  try {
    let playerTwo = null;
    playerTwo = req.body.playerTwo;

    const query = knex("rooms")
      .update({
        player_two: playerTwo,
      })
      .where("code", req.body.code)
      .returning("*")
      .toString();

    const result = await pg_client.query(query);

    const query2 = knex("game")
      .insert({
        room_code: req.body.code,
        grid_length: 10,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*")
      .toString();

    await pg_client.query(query2);
    resp.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};
