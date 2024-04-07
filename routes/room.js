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

    const query2 = knex("game")
      .insert({
        room_code: result.rows[0].code,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*")
      .toString();

    await pg_client.query(query2);

    resp
      .status(200)
      .json({ data: { ...result.rows[0], person_id: personId }, status: 200 });
  } catch (err) {
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};

exports.joinRoom = async (req, resp) => {
  try {
    let personId = null;
    let playerTwo = null;
    let playerOne = null;
    req.body = JSON.parse(req.body);

    playerTwo = req.body.player_two;
    personId = req.session.authentication.person_id;

    const query1 = knex("rooms")
      .select("*")
      .where("code", req.body.code)
      .toString();

    const result1 = await pg_client.query(query1);
    playerOne = result1.rows?.[0]?.player_one;

    if (playerOne == playerTwo) {
      return resp
        .status(400)
        .json({ status: 400, message: "Join with diffrent code" });
    }

    const query = knex("rooms")
      .update({
        player_two: playerTwo,
      })
      .where("code", req.body.code)
      .returning("*")
      .toString();

    const result = await pg_client.query(query);

    const query2 = knex("game")
      .update({
        grid: JSON.stringify(
          [...Array(10).keys()].map((_, id) => ({
            id,
            [playerOne]: {
              decison: null,
            },
            [playerTwo]: {
              decison: null,
            },
          }))
        ),
      })
      .where("room_code", req.body.code)
      .returning("*")
      .toString();

    await pg_client.query(query2);

    resp
      .status(200)
      .json({ data: { ...result.rows[0], person_id: personId }, status: 200 });
  } catch (err) {
    console.log(err);
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};
