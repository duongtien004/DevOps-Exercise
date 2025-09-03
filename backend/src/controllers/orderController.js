const userService = require("../services/userService");
const orderService = require("../services/orderService");
const jwtService = require("../services/jwtService");

const createOrder = async (req, res) => {
  try {
    let orderData;
    orderData = req.body;
    if (
      !orderData.orderItems ||
      !orderData.shippingAddress ||
      !orderData.itemsPrice ||
      !orderData.shippingPrice ||
      !orderData.taxPrice ||
      !orderData.totalPrice ||
      !orderData.user
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    // if (orderData.orderStatus === "COMPLETED") {
    //   orderData.orderStatus === "COMPLETED";
    // }
    const response = await orderService.createOrder(orderData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    console.log(data);

    const response = await orderService.updateOrder(orderId, data.orderStatus);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await orderService.deleteOrder(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const response = await orderService.getAllOrder(
      Number(limit),
      Number(page)
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllOrderByUser = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const id = req.params.id;
    const response = await orderService.getAllOrderByUser(
      Number(limit),
      Number(page),
      id
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getDetaiOrder = async (req, res) => {
  try {
    const Id = req.params.id;
    console.log(Id);

    if (!Id) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await orderService.getDetailOrder(Id);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrder,
  getDetaiOrder,
  getAllOrderByUser,
};
