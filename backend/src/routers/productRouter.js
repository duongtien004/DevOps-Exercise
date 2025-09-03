const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadProductImages } = require("../middleware/uploadMiddleware");
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getDetailProduct);
router.post(
  "/",
  authMiddleware,
  uploadProductImages,
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware,
  uploadProductImages,
  productController.updateProduct
);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
