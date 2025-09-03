const Category = require("../models/categoryModel");

// const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");

const createCategory = (newCategory) => {
  return new Promise(async (resolve, reject) => {
    const { title, parent_id } = newCategory;

    try {
      const createdCategory = await Category.create({
        title,
        parent_id,
      });

      if (createdCategory) {
        resolve({
          status: "ok",
          messsage: "Category created successfully",
          data: createdCategory,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCategory = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({ _id: id });
      console.log(checkCategory);

      if (checkCategory === null) {
        resolve({
          status: "ok",
          messsage: "The category is not existing",
        });
      }

      const updateCategory = await Category.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "ok",
        messsage: "Successfully",
        data: updateCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({ _id: id });

      if (checkCategory === null) {
        resolve({
          status: "ok",
          messsage: "The category is not existing",
        });
      }

      const deleteCategory = await Category.findByIdAndDelete(id);

      resolve({
        status: "ok",
        messsage: "delete Successfully",
        data: deleteCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCategory = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(filter);

      const totalCategory = await Category.countDocuments();
      if (filter) {
        const label = filter[0];
        const allCategoryFilter = await Category.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);
        const totalCategoryFilter = await Category.countDocuments({
          [label]: { $regex: filter[1] },
        });
        resolve({
          status: "ok",
          messsage: "Get all successfully",
          totalCategory: totalCategoryFilter,
          pageCurent: Number(page + 1),
          totalPage: Math.ceil(totalCategoryFilter / limit),
          data: allCategoryFilter,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allCategorySort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);

        resolve({
          status: "ok",
          messsage: "Get all successfully",
          totalCategory: totalCategory,
          pageCurent: Number(page + 1),
          totalPage: Math.ceil(totalCategory / limit),
          data: allCategorySort,
        });
      }
      const all = await Category.find()
        .limit(limit)
        .skip(page * limit);

      resolve({
        status: "ok",
        messsage: "Get all successfully",
        totalCategory: totalCategory,
        pageCurent: Number(page + 1),
        totalPage: Math.ceil(totalCategory / limit),
        data: all,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findOne({ _id: id });

      if (category === null) {
        resolve({
          status: "ok",
          messsage: "The category is not existing",
        });
      }

      resolve({
        status: "ok",
        messsage: "Get detail successfully",
        data: category,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getDetailCategory,
};
