const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { APIError } = require("../helpers/error");
const { roles, status, todoStatus } = require("./../helpers/constant");

const userschema = mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    username: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: function (value) {
        return validator.isEmail(value);
      },
    },
    pswd: {
      type: String,
      required: true,
      set: function (value) {
        return bcrypt.hashSync(value, 10);
      },
      phone: {
        type: String,
        unique: true,
      },
    },
    role: {
      type: String,
      default: roles.S,
      enum: [roles.S, roles.R, roles.V],
    },
    department: {
      type: String,
    },
    status: {
      type: String,
      default: status.A,
      enum: [status.A, status.B],
    },
  },
  {
    timestamps: true,
  }
);

userschema.method("createUser", async function (user) {
  let User = this.model("User");
  if ((await User.findOne({ email: user.email })) !== null) {
    throw new APIError(400, "User with this email already exists");
  }
  if ((await User.findOne({ username: user.username })) !== null) {
    throw new APIError(400, "User with this username already exists");
  }

  return await User.create(user);
});

userschema.method("checkIfUserWithEmailExists", async function (email) {
  let User = this.model("User");
  let user = await User.findOne({ email });

  if (user == null) {
    throw new APIError(404, "No user with this email exists");
  }
  return user;
});

userschema.method("checkUserRole", async function () {
  let User = this.model("User");
  let user = await User.findOne({ _id: this._id, role: this.role });
  if (user == null) {
    return false;
  }
  return true;
});

userschema.method("checkIfUserWithUsernameExists", async function (username) {
  let User = this.model("User");
  return await User.findOne({ username }).select("username");
});

userschema.method("getUser", async function (_id) {
  let User = this.model("User");
  let user = await User.findOne({ _id }).select("-pswd");
  if (!user) {
    throw new APIError(404, "No user found");
  }
  return user;
});

userschema.method("checkPass", function (user, pswd) {
  return bcrypt.compareSync(pswd, user.pswd);
});

userschema.method("updatePassword", async function (pswd) {
  const user = await this.model("User").findOne({ _id: this._id });
  if (user == null) {
    throw new APIError(404, "No User Found");
  }
  if (bcrypt.compareSync(pswd, user.pswd)) {
    return user.updateOne({ pswd: this.pswd });
  }
  throw new APIError(404, "old password is not match");
});

userschema.method("deleteUser", async function (_id) {
  return await this.model("User").deleteOne({ _id });
});

module.exports = mongoose.model("User", userschema);
