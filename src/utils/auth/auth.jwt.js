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
      expiresIn: "15d",
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
  new Promise((resolve) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) resolve(null);

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
    if (!user) return false;
    user.refreshToken = newRefreshToken(user);
    user.accessToken = newAccessToken(user);
    return user;
  } catch (err) {
    console.error(err.message);
    console.error(err);
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

    user.refreshToken = newRefreshToken(user);
    user.accessToken = newAccessToken(user);

    return user;
  } catch (err) {
    console.error(err.message);
    console.error(err);
    throw err;
  }
};

// ==================================================================

/*
 *  4 cases of authentication
 *
 *  tokens are passed through requset headers authorization
 *
 *  case 1 : access  token is valid   -> return user
 *  case 2 : refresh token is valid   -> return user with new tokens
 *  case 3 : refresh token is invalid -> return null (unauthenticated)
 *  case 4 : invalid or no tokens (invalid not expired) -> return null
 *
 * */

// ==================================================================

// Protect route by token
// check if the given token is verified
// check if the payload of user id of the vverified token is in the database
// token comes in user comes out
const protect = async (accessToken, refreshToken) => {
  try {
    // verified access token payload
    let payload = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // case 1
    if (payload) {
      let user = await crud.findOne("user", { _id: payload.id });
      if (!user) {
        console.log("here because of in valid access token");
        return false;
      }

      // no need to refresh the tokens
      user.accessToken = "";
      user.refreshToken = "";
      console.log("valid access token");
      return user; // case 1 halt
    }

    // case 2
    payload = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // case 3
    if (!payload) {
      console.log("here because of expired refresh token need to login ");
      return false; // case 3 halt refresh token also expired or invalid need to login
    }

    console.log("in valid access token but valid refresh token");
    let user = await crud.findOne("user", { _id: payload.id });

    // case 3
    // console.log(" payload count ");
    // if (payload.count !== user.count) {
    //   console.log("false here because count");
    //   return false;
    // }
    // user.count += 1;
    // await user.save();

    user.accessToken = newAccessToken(user);
    user.refreshToken = newRefreshToken(user);
    console.log("update the tokens ");
    return user;
  } catch (err) {
    console.error(err.message);
    console.error(err);
    throw err;
  }
};

// ==================================================================
module.exports = { newToken, verifyToken, signUp, logIn, protect };
