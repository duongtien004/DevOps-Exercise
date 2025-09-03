const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");
const orderRouter = require("./orderRouter");
// const uploadRouter = require("./uploadRouter");
const routes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/product", productRouter);
  app.use("/api/order", orderRouter);
  // app.use("/api/upload", uploadRouter);
};

module.exports = routes;
