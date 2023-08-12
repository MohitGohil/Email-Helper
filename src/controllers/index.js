async function getHandler(req, res) {
  return res.status(200).json({ message: "Hello from getHandler" });
}

async function postHandler(req, res) {
  return res.status(200).json({ message: "Hello from postHandler" });
}

module.exports = { getHandler, postHandler };
