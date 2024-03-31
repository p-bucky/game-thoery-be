const { v4: uuidv4 } = require("uuid");

async function sessionHandler(req, resp, next) {
  req.session.authentication = {}
  req.session.authentication.person_id = uuidv4();
  next()
}

module.exports = { sessionHandler };
