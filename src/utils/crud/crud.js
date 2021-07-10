/* Generic Mongo Crud  */
/**
 * This module works as seprate layer just as generic crud
 * this module called by the express controller or auth ( signup / login )
 * this generic crud for mongodb
 */
const mongoose = require("mongoose");
const user = require("../../resources/user/user.model.js");
const models = { user };

// ========================================================

// Create one
const create = async (modelName, body) => {
  try {
    return await models[modelName].create(body);
  } catch (err) {
    err.errorFrom = "database";
    throw err;
  }
};

// ========================================================

// Select all
const findAll = async (modelName) => {
  try {
    return await models[modelName].find();
  } catch (err) {
    err.errorFrom = "database";
    throw err;
  }
};

// ========================================================

// Select one by id
const findOne = async (modelName, body) => {
  try {
    return await models[modelName].findOne({ ...body });
  } catch (err) {
    err.errorFrom = "database";
    console.error("err", err);
    throw err;
  }
};

// ========================================================

// Update one by id
const update = async (modelName, body) => {
  try {
    return await models[modelName].updateOne(body, { _id: body.id });
  } catch (err) {
    err.errorFrom = "database";
    throw err;
  }
};

// ========================================================

// Delete one by id
const destroy = async (modelName, body) => {
  try {
    const doc = await models[modelName].deleteOne({ ...body });
    return await doc.n;
  } catch (err) {
    err.errorFrom = "database";
    throw err;
  }
};

// ========================================================

module.exports = { create, findAll, findOne, update, destroy };
