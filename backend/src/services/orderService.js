const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const createOrder = (orderData) => {
  console.log(orderData);

  return new Promise(async (resolve, reject) => {
    try {
      const validatedItems = await Promise.all(
        orderData.orderItems.map(async (item) => {
          const product = await Product.findById(item._id);
          console.log(product);

          return {
            name: product.name,
            amount: item.quantity,
            image: item.thumbnail,
            price: item.price,
            product: product._id,
          };
        })
      );

      const order = new Order({
        orderItems: validatedItems,
        shippingAddress: orderData.shippingAddress,
        itemsPrice: orderData.itemsPrice,
        shippingPrice: orderData.shippingPrice,
        taxPrice: orderData.taxPrice,
        totalPrice: orderData.totalPrice,
        user: orderData.user,
        orderStatus: orderData.orderStatus,
      });

      const savedOrder = await order.save();

      await Promise.all(
        validatedItems.map(async (item) => {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: { countInStock: -item.amount },
            },
            { new: true }
          );
        })
      );

      resolve({
        status: "OK",
        message: "Successfully created order",
        data: savedOrder,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const updateOrder = (id, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({ _id: id });
      console.log("order", checkOrder);

      if (checkOrder === null) {
        resolve({
          status: "ERR",
          message: "The order is not existing",
        });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { orderStatus: status },
        { new: true }
      );
      // ).populate('user', 'name email')
      //   .populate('orderItems.product', 'name price');

      resolve({
        status: "OK",
        message: "Successfully updated order status",
        data: updatedOrder,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const deleteOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({ _id: id });

      if (checkOrder === null) {
        resolve({
          status: "ok",
          message: "The order is not existing",
        });
      }

      const deletedOrder = await Order.findByIdAndDelete(id);

      resolve({
        status: "ok",
        message: "Successfully deleted order",
        data: deletedOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy danh sách sản phẩm
      const allOrders = await Order.find()
        .limit(limit)
        .skip(page * limit);

      // Tổng số sản phẩm trong cơ sở dữ liệu
      const totalOrder = await Order.estimatedDocumentCount();

      resolve({
        status: "ok",
        message: "Get all successfully",
        totalOrder: totalOrder,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalOrder / limit),
        data: allOrders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderByUser = (limit, page, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy danh sách sản phẩm
      const allOrders = await Order.find({ user: id })
        .limit(limit)
        .skip(page * limit);

      // Tổng số sản phẩm trong cơ sở dữ liệu
      const totalOrder = await Order.countDocuments({ user: id });

      resolve({
        status: "ok",
        message: "Get all successfully",
        totalOrder: totalOrder,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalOrder / limit),
        data: allOrders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({ _id: id });

      if (order === null) {
        resolve({
          status: "ok",
          messsage: "The product is not existing",
        });
      }

      resolve({
        status: "ok",
        messsage: "Get detail successfully",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrder,
  getDetailOrder,
  getAllOrderByUser,
};
