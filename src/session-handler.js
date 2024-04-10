const { v4: uuidv4 } = require("uuid");

async function sessionHandler(req, resp, next) {
  if (!req.session?.authentication?.is_logged_in) {
    req.session.authentication = {};
    req.session.authentication.person_id = uuidv4();
    req.session.authentication.is_logged_in = true;
  }
  next();
}

module.exports = { sessionHandler };
