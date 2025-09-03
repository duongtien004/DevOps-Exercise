const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/", orderController.createOrder);
router.get("/", authMiddleware, orderController.getAllOrder);
router.get("/:id", orderController.getDetaiOrder);
router.get(
  "/get-by-user/:id",
  authUserMiddleware,
  orderController.getAllOrderByUser
);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", authMiddleware, orderController.deleteOrder);

module.exports = router;
