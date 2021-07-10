require("dotenv").config();
const mongoose = require("mongoose");

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    if (connection) console.log("Database Connected !");

    return connection;
  } catch (err) {
    err.errorFrom = "database";
    console.error(err.message);
    console.error(err.trace);
  }
};

export default connect;
