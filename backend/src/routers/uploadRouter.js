// const express = require("express");
// const router = express.Router();

// const {
//   uploadSingleImage,
// } = require("../middleware/uploadMiddleware");

// router.post("/upload-image", uploadSingleImage, (req, res) => {
//   if (req.file) {
//     res.status(201).json({
//       message: "Image uploaded successfully",
//       filePath: `/uploads/images/${req.file.filename}`,
//     });
//   } else {
//     res.status(400).json({ message: "No file uploaded" });
//   }
// });
// // router.post("/upload-more-image", uploadFiles, (req, res) => {
// //   console.log(req.files);
// //   if (req.files && req.files.length > 0) {
// //     const filePaths = req.files.map(
// //       (file) => `/uploads/images/${file.filename}`
// //     );
// //     res.status(201).json({
// //       message: "Images uploaded successfully",
// //       filePaths: filePaths,
// //     });
// //   } else {
// //     res.status(400).json({ message: "No files uploaded" });
// //   }
// // });

// module.exports = router;
