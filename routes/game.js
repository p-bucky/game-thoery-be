const { pg_client } = require("../db");
const { knex } = require("../db/query-builder");

exports.getGame = async (req, resp) => {
  try {
    let data = null;
    const query = knex("game").select("*").toString();
    const result = await pg_client.query(query);

    const query2 = knex("opinions").select("*").toString();
    const opnionsRes = await pg_client.query(query2);

    data = {
      ...(result.rows[0] || {}),
      opinions: opnionsRes.rows,
    };
    resp.render("game", data);
  } catch (err) {
    console.log(err);
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};
