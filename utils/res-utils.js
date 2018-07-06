function handleError(err, res) {
  return res.status(520).json({ error: { message: err } });
}

module.exports = {
  handleError
}