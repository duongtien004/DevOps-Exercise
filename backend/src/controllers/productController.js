const productService = require("../services/productService");
// const jwtService = require("../services/jwtService");
// Helper function to process single image path
const processImagePath = (path) => {
  if (!path) return null;
  return path.replace(/\\/g, "/").replace(/^.*\/uploads/, "uploads");
};

// Helper function to process multiple image paths
const processMultipleImagePaths = (files) => {
  if (!files || !Array.isArray(files)) return [];
  return files.map((file) => processImagePath(file.path)).filter(Boolean);
};
const createProduct = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "name",
      "price",
      "countInStock",
      "description",
      "category",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "ERR",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    // Process thumbnail
    const thumbnailPath = processImagePath(req.files?.thumbnail?.[0]?.path);
    if (!thumbnailPath) {
      return res.status(400).json({
        status: "ERR",
        message: "Product thumbnail is required",
      });
    }
    // Process product images
    const imagePaths = processMultipleImagePaths(req.files?.images);
    if (!imagePaths || imagePaths.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "At least one product image is required",
      });
    }
    // Construct the product data
    const productData = {
      name: req.body.name.trim(),
      price: req.body.price,
      countInStock: req.body.countInStock,
      description: req.body.description.trim(),
      category: req.body.category,
      thumbnail: thumbnailPath,
      images: imagePaths,
      // discount: parseFloat(req.body.discount) || 0,
    };
    console.log("Processed Product Data:", productData);
    const response = await productService.createProduct(productData);
    return res.status(201).json({
      status: "OK",
      message: "Product created successfully",
      data: response,
    });
  } catch (e) {
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const Id = req.params.id;
    console.log("id: " + Id);
    if (!Id) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const existingProduct = await productService.getDetailProduct(Id);
    if (!existingProduct) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }

    const data = req.body;
    // Xử lý thumbnail
    const newThumbnail = req.files?.thumbnail
      ? processImagePath(req.files.thumbnail[0].path)
      : existingProduct.data.thumbnail;

    // Xử lý images
    const newImages = req.files?.images?.length
      ? processMultipleImagePaths(req.files.images)
      : existingProduct.data.images;

    // Xóa ảnh thumbnail cũ nếu có ảnh mới
    if (req.files?.thumbnail && existingProduct.data.thumbnail) {
      deleteFile(
        path.join(__dirname, "../../uploads", existingProduct.thumbnail)
      );
    }

    // Xóa ảnh trong danh sách images cũ không còn sử dụng
    if (req.files?.images?.length) {
      if (existingProduct.data.images.length > 0) {
        const imagesToDelete = existingProduct.data.images.filter(
          (oldImage) => !newImages.includes(oldImage)
        );
        imagesToDelete.forEach((imagePath) => {
          deleteFile(path.join(__dirname, "../../uploads", imagePath));
        });
      }
    }

    // Gán giá trị mới
    data.thumbnail = newThumbnail;
    data.images = newImages;
    const response = await productService.updateProduct(Id, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const Id = req.params.id;
    // const token = req.headers;
    const response = await productService.deleteProduct(Id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await productService.getAllProduct(
      Number(limit),
      Number(page),
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    const Id = req.params.id;
    console.log(Id);

    if (!Id) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await productService.getDetailProduct(Id);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
};
