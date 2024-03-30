const { pg_client } = require("../db");
const { knex } = require("../db/query-builder");

exports.getGame = async (req, resp) => {
  try {
    let data = null;
    const query = knex("game").select("*").toString();
    const result = await pg_client.query(query);

    data = {
      ...(result.rows[0] || {}),
    };
    console.log(data);

    resp.render("game", data);
  } catch (err) {
    resp.json({ message: "Something went wrong", status: 500 }).status(500);
  }
};
