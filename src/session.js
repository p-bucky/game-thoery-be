const session = require('express-session');

async function setupSession(app) {
  let store;
  const StoreCreator = (await import("connect-pg-simple")).default;
  const pg = (await import("pg")).default;
  const PostgresStore = new StoreCreator(session);
  const pool = new pg.Pool({
    connectionString: process.env.SESSION_STORE_POSTGRES,
    max: 3,
    connectionTimeoutMillis: 30000,
  });
  store = new PostgresStore({
    pool,
    tableName: "user_sessions",
    schemaName: "public",
  });

  app.use(
    session({
      store,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: false,
        cookie: { maxAge: 60 * 60 * 1000 },
      },
    })
  );
}

module.exports = setupSession;
