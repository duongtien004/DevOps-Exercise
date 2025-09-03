const User = require("../models/userModel");
const blacklistService = require("./blacklistService");

var crypto = require("crypto");

const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone, isAdmin } = newUser;

    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser !== null) {
        resolve({
          status: "ok",
          messsage: "The email is already ",
        });
      }

      const hash = crypto.createHash("sha256");
      hash.update(password);
      const hashedPassword = hash.digest("hex");

      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        isAdmin: isAdmin ? true : false,
      });

      if (createdUser) {
        resolve({
          status: "ok",
          messsage: "User created successfully",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;

    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser === null) {
        resolve({
          status: "ok",
          messsage: "The user is not existing",
        });
      }
      const hash = crypto.createHash("sha256");
      hash.update(password);
      const hashedPassword = hash.digest("hex");

      if (hashedPassword !== checkUser.password) {
        resolve({
          status: "ok",
          messsage: "The password or user is incorrect",
        });
      }

      console.log("problem", checkUser);

      const access_token = await genneralAccessToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = await genneralRefreshToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });

      console.log(checkUser);

      resolve({
        status: "ok",
        messsage: "Successfully",
        access_token: access_token,
        refresh_token: refresh_token,
        user: checkUser,
        // data: createUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      console.log(checkUser);

      if (checkUser === null) {
        resolve({
          status: "ok",
          messsage: "The user is not existing",
        });
      }

      const updateUser = await User.findByIdAndUpdate(id, data);

      resolve({
        status: "ok",
        messsage: "Successfully",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        resolve({
          status: "ok",
          messsage: "The user is not existing",
        });
      }

      const deleteUser = await User.findByIdAndDelete(id);

      resolve({
        status: "ok",
        messsage: "delete Successfully",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = (limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalUser = await User.estimatedDocumentCount();
      const all = await User.find()
        .limit(limit)
        .skip(page * limit);

      resolve({
        status: "ok",
        messsage: "getall Successfully",
        totalUser: totalUser,
        pageCurent: Number(page + 1),
        totalPage: Math.ceil(totalUser / limit),
        data: all,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });

      if (user === null) {
        resolve({
          status: "ok",
          messsage: "The user is not existing",
        });
      }

      resolve({
        status: "ok",
        messsage: "detail Successfully",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const logoutUser = (access_token, refresh_token) => {
  return new Promise(async (resolve, reject) => {
    try {
      await blacklistService.addToBlacklist(access_token);
      await blacklistService.addToBlacklist(refresh_token);

      resolve({
        status: "ok",
        message: "Logout Successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  logoutUser,
};
