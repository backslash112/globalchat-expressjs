
function loginRequired(req, res, next) {
    if (req.user) {
        next();
    } else {
      return res.status(401).json({ error: { message: 'Unauthorized user!' }});
    }
}
module.export = loginRequired;