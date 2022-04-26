const service = require("./theaters.service");

// CRUD FUNCTIONS
// list all theaters with their movies
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

module.exports = {
  list,
};
