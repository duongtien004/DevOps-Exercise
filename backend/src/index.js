const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routers");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
app.use(cors());
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const mongoUrl = process.env.MONGODB_URL;
console.log(mongoUrl);

// Support JSON
app.use(bodyParser.json());

// Support Form Data
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// // Hoặc sử dụng formidable nếu cần xử lý file upload
// app.use(formidable());
routes(app);

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });
