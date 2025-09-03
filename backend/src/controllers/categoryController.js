const categoryService = require("../services/categoryService");
// const jwtService = require("../services/jwtService");

const createCategory = async (req, res) => {
  try {
    let categoryData;
    const contentType = req.headers["content-type"];
    console.log(req.body);

    if (contentType.includes("application/json")) {
      categoryData = req.body;
    } else if (contentType.includes("multipart/form-data")) {
      categoryData = req.fields;
    }
    const { title, parent_id } = categoryData;
    // console.log(email);

    if (!title) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await categoryService.createCategory(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log("categoryid: " + categoryId);
    const data = req.body;
    if (!categoryId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await categoryService.updateCategory(categoryId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    // const token = req.headers;
    const response = await categoryService.deleteCategory(categoryId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await categoryService.getAllCategory(
      Number(limit),
      Number(page),
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log(categoryId);

    if (!categoryId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await categoryService.getDetailCategory(categoryId);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getDetailCategory,
};
