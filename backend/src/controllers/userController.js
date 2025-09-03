const userService = require("../services/userService");
const jwtService = require("../services/jwtService");

const createUser = async (req, res) => {
  try {
    let userData;

    const contentType = req.headers["content-type"];

    if (contentType.includes("application/json")) {
      userData = req.body;
    } else if (contentType.includes("multipart/form-data")) {
      userData = req.fields;
    }
    // } else if (contentType.includes("application/x-www-form-urlencoded")) {
    //   userData = req.body;
    // }
    const { name, email, password, confirmPassword, phone } = userData;
    console.log(email);

    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is equal confirmPassword ",
      });
    }
    console.log("isCheckEmail", isCheckEmail);
    const response = await userService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let userData;

    const contentType = req.headers["content-type"];
    if (contentType.includes("application/json")) {
      userData = req.body;
    }

    const { email, password } = userData;

    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }

    const response = await userService.loginUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("userid: " + userId);
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    if (req.file) {
      data.avatar = `/uploads/images/${req.file.filename}`;
    }
    const response = await userService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers;
    const response = await userService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await userService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await userService.getDetailUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await jwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body;
    console.log("long ngon", access_token);
    const response = await userService.logoutUser(access_token, refresh_token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
  logoutUser,
};
