const multer = require("multer");
const path = require("path");
const fs = require("fs");

class ImageUploadHandler {
  constructor() {
    // Cấu hình storage cho multer
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../../uploads/images");
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    });

    // Cấu hình filter cho file
    this.fileFilter = (req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Invalid file type. Only JPEG, PNG, JPG, and GIF are allowed."
          )
        );
      }
    };

    // Khởi tạo multer
    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
    });
  }

  // Xử lý decode base64 và lưu file
  async handleBase64Upload(base64String, customFileName = null) {
    try {
      // Kiểm tra và tách định dạng ảnh từ base64
      const matches = base64String.match(/^data:image\/([a-zA-Z+]+);base64,/);
      if (!matches) throw new Error("Invalid base64 image format");

      const imageType = matches[1];
      const base64Data = base64String.replace(
        /^data:image\/[a-zA-Z+]+;base64,/,
        ""
      );
      const buffer = Buffer.from(base64Data, "base64");

      // Tạo tên file
      const fileName =
        customFileName ||
        `${Date.now()}-${Math.round(Math.random() * 1e9)}.${imageType}`;
      const uploadPath = path.join(__dirname, "../../uploads/images");

      // Tạo thư mục nếu chưa tồn tại
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const filePath = path.join(uploadPath, fileName);

      // Lưu file
      await fs.promises.writeFile(filePath, buffer);

      return {
        path: `/uploads/images/${fileName}`,
        filename: fileName,
      };
    } catch (error) {
      throw new Error(`Base64 processing error: ${error.message}`);
    }
  }

  // Middleware xử lý upload single image (avatar, thumbnail)
  handleSingleUpload(fieldName) {
    return async (req, res, next) => {
      try {
        // Xử lý multipart/form-data upload
        const uploadHandler = this.upload.single(fieldName);

        await new Promise((resolve, reject) => {
          uploadHandler(req, res, (err) => {
            if (err) reject(err);
            resolve();
          });
        });

        // Xử lý base64 upload nếu không có file upload
        if (!req.file && req.body[fieldName]) {
          if (req.body[fieldName].startsWith("data:image")) {
            const result = await this.handleBase64Upload(req.body[fieldName]);
            req.file = result;
          }
        }

        next();
      } catch (error) {
        return res.status(400).json({
          message:
            error instanceof multer.MulterError
              ? `Upload error: ${error.message}`
              : `File processing error: ${error.message}`,
        });
      }
    };
  }

  // Middleware xử lý upload multiple images
  handleMultipleUpload(fields) {
    return async (req, res, next) => {
      try {
        // Xử lý multipart/form-data upload
        const uploadHandler = this.upload.fields(fields);

        await new Promise((resolve, reject) => {
          uploadHandler(req, res, (err) => {
            if (err) reject(err);
            resolve();
          });
        });

        // Xử lý base64 upload cho từng field
        for (const field of fields) {
          const fieldName = field.name;
          const maxCount = field.maxCount;

          // Nếu field là array của base64 strings
          if (!req.files?.[fieldName] && req.body[fieldName]) {
            const base64Array = Array.isArray(req.body[fieldName])
              ? req.body[fieldName]
              : [req.body[fieldName]];

            if (base64Array.length > maxCount) {
              throw new Error(
                `Too many files for field ${fieldName}. Maximum is ${maxCount}`
              );
            }

            const uploadedFiles = await Promise.all(
              base64Array
                .filter((base64) => base64.startsWith("data:image"))
                .map((base64) => this.handleBase64Upload(base64))
            );

            req.files = {
              ...req.files,
              [fieldName]: uploadedFiles,
            };
          }
        }

        next();
      } catch (error) {
        return res.status(400).json({
          message:
            error instanceof multer.MulterError
              ? `Upload error: ${error.message}`
              : `File processing error: ${error.message}`,
        });
      }
    };
  }
}

// Khởi tạo handler
const imageHandler = new ImageUploadHandler();

// Export các middleware
module.exports = {
  // Middleware xử lý upload avatar
  uploadAvatar: imageHandler.handleSingleUpload("avatar").bind(imageHandler),
  // Middleware xử lý upload nhiều ảnh cho product
  uploadProductImages: imageHandler
    .handleMultipleUpload([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ])
    .bind(imageHandler),
};
