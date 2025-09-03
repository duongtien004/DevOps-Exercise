const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
    },
    // access_token: {
    //   type: String,
    //   required: true,
    // },
    // refresh_token: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
