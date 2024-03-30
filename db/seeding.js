const path = require("node:path");
const fs = require("node:fs/promises");
const { pg_client } = require(".");
const chalk = require("chalk");

const tables = ["opinions"];

async function runSeeding() {
  if (
    process.env.NODE_ENV == "production" ||
    process.env.SEEDING != "true" ||
    !process.env.DB_SEED_PATH
  ) {
    return;
  }

  for (const name of tables) {
    try {
      console.log(chalk.yellow.bold(`SEEDING => ${name}, STATUS: STARTED`));
      const dataPath = path.resolve(process.env.DB_SEED_PATH, `${name}.json`);
      const data = await fs.readFile(dataPath, { encoding: "utf-8" });
      const dataList = JSON.parse(data);

      // CLEAR TABLE
      await pg_client.query(`TRUNCATE TABLE ${name} CASCADE`);

      for (const row of dataList) {
        const [query, values] = makeInsertQuery(row, name);
        await pg_client.query(query, values);
      }
      console.log(chalk.green.bold(`SEEDING => ${name}, STATUS: COMPLETED`));
    } catch (err) {
      console.log(err);
    }
  }
}

const makeInsertQuery = (data, tableName) => {
  // TODO: use knex
  let query = `insert into ${tableName}`;
  let values = [];

  const rows = [...Object.keys(data.values), "updated_at", "created_at"];

  query += `(${rows.join(",")}) values (${Array.from(
    rows,
    (_, i) => `$${i + 1}`
  ).join(",")}) returning *`;

  for (const row of rows) {
    if (["updated_at", "created_at"].includes(row)) {
      values.push(new Date().toISOString());
      continue;
    }
    // TODO: Look here
    if (data.values[row].constructor.name == "Object") {
      values.push(JSON.stringify(data.values[row]));
      continue;
    }
    values.push(data.values[row]);
  }

  return [query, values];
};
module.exports = { runSeeding };
