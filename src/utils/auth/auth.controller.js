const auth = require("./auth.jwt.js");

// ==================================================================

/*  Get Signup , Login , Logut ( render views )  */

// const logoutGet = async (req, res, next) => {
//     res.cookie("jwt", "", { maxAge: 0 });
//     res.redirect("/login");
// };

// ==================================================================

/* Post Register , Login ( Call the database  ) */

const register = async ({ username, password }) => {
  try {
    const { user } = await auth.signUp({ username, password, count: 0 });
    if (!user) return false;
    return true;
  } catch (err) {
    console.error(err.message);
    console.error(err);
  }
};

// ==================================================================

const login = async ({ username, password }, { res }) => {
  try {
    const { user, refreshToken, accessToken } = await auth.logIn({
      username,
      password,
    });

    if (!user) return false;

    res.cookie("refresh-token", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie("access-token", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
    });

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    return user;
  } catch (err) {
    console.error(err.message);
    console.error(err);
  }
};

// ==================================================================

// Authentication middle ware
const protect = async (req, res, next) => {
  try {
    console.log("req", req.body);
    next();
  } catch (err) {
    next(err);
  }
};

// ==================================================================

module.exports = { register, login, protect };
