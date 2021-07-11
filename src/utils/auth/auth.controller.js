/*
 * Auth Controller  is the module resoponsible for
 * the authentication / authorization of the  web layer
 * either of GraphQL or REST api
 * and it's return is the last endpoint to the response
 *
 */

const auth = require("./auth.jwt.js");

// ==================================================================

/*  Get Signup , Login , Logut ( render views )  */

// const logoutGet = async (req, res, next) => {
//     res.cookie("jwt", "", { maxAge: 0 });
//     res.redirect("/login");
// };

// ==================================================================

/* Post Register */

const register = async ({ username, password }, { res }) => {
  try {
    const user = await auth.signUp({ username, password, count: 0 });
    if (!user) return false;
    // in case you use cookies
    /*
        res.cookie("refresh-token", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.cookie("access-token", accessToken, {
          maxAge: 1000 * 60 * 60 * 24,
        });
    */
    return user;
  } catch (err) {
    console.error(err.message);
    console.error(err);
  }
};

// ==================================================================

/* Login Register */

const login = async ({ username, password }, { res }) => {
  try {
    const user = await auth.logIn({ username, password });
    if (!user) return false;
    // in case you use cookies
    /*
        res.cookie("refresh-token", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.cookie("access-token", accessToken, {
          maxAge: 1000 * 60 * 60 * 24,
        });
    */
    return user;
  } catch (err) {
    console.error(err.message);
    console.error(err);
  }
};

// ==================================================================

// Authentication middle ware
const protect = async (req, res) => {
  try {
    if (!req.headers.authorization) return null; // no tokens

    const { accessToken, refreshToken } = JSON.parse(req.headers.authorization);
    const verifiedUser = await auth.protect(accessToken, refreshToken);

    if (!verifiedUser) return null; // unAuthenticated
    return verifiedUser;
  } catch (err) {
    console.error(err.message);
    console.error(err);
  }
};

// ==================================================================

module.exports = { register, login, protect };
