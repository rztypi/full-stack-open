const config = require("./config");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  } else {
    req.token = null;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "invalid token" });
  }

  req.user = {
    username: decodedToken.username,
    id: decodedToken.id,
  };

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({
    error: "unknown endpoint",
  });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  } else if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (
    err.name === "MongoServerError" &&
    err.message.includes("E11000 duplicate key error collection")
  ) {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: err.message });
  }
  return next(err);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
