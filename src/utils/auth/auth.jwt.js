const jwt = require("jsonwebtoken");
const crud = require("../crud/crud.js");
// ================================================================

// Create a new Token
// take a new user id from the database
// create a new user token based on user id
// user comes in token comes out

const newToken = (user) =>
  jwt.sign({ id: user._id }, process.env.jwtSecret, {
    expiresIn: process.env.jwtExpires,
  });

// ================================================================

const newRefreshToken = (user) =>
  jwt.sign(
    { id: user._id, count: user.count },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

// ================================================================

const newAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

// ================================================================

// Verify a given token
// verify that token was created with the same secret ( hash )
// from the same server
// token comes in user comes out
const verifyToken = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err);

      return resolve(payload);
    });
  });

// ================================================================

// Sign up user by a given object
// create a new token for a new user
// new user payload comes in token comes out
const signUp = async (payload) => {
  try {
    const user = await crud.create("user", payload);
    const refreshToken = newRefreshToken(user);
    const accessToken = newAccessToken(user);
    return { user, refreshToken, accessToken };
  } catch (err) {
    throw err;
  }
};

// ================================================================

// Login a user by his email and password
// create a new token for logged in user
// user comes in token comes out
const logIn = async ({ username, password }) => {
  try {
    const user = await crud.findOne("user", { username });
    if (!user) return false;

    const match = await user.checkPassword(password);
    if (!match) return false;

    const refreshToken = newRefreshToken(user);
    const accessToken = newAccessToken(user);

    return { user, refreshToken, accessToken };
  } catch (err) {
    throw err;
  }
};

// ==================================================================

// Protect route by token
// check if the given token is verified
// check if the payload of user id of the vverified token is in the database
// token comes in user comes out
const protect = async (token, secret) => {
  try {
    const payload = await verifyToken(token, secret);
    if (!payload) return false;

    const user = await crud.findOne("user", { _id: payload.id });
    if (!user) return false;

    return user;
  } catch (err) {
    throw err;
  }
};

// ==================================================================
module.exports = { newToken, verifyToken, signUp, logIn, protect };
