const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      lowercase: true,
      minlength: [6, "Minimum username length is 6 characters"],
    },
    count: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Minimum password length is 6 characters"],
    },
    followers: [{ username: String, createdAt: String }],
    following: [{ username: String, createdAt: String }],
  },
  { timestamps: true }
);

/* Mongoose Hooks */

// Execute this function before doc saved to db
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

/* Mongoose methods */
userSchema.methods.checkPassword = async function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, same) => {
      if (err) {
        return reject(err);
      }
      return resolve(same);
    });
  });
};

module.exports = mongoose.model("user", userSchema);
