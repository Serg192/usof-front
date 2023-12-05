// const multer = require("multer");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, process.env.FILE_UPLOAD_PATH);
//   },
//   filename: (req, file, cb) => {
//     console.log("Here");
//     try {
//       const id = uuidv4();
//       const filename = `${id}${path.extname(file.originalname)}`;
//       cb(null, filename);
//     } catch (error) {
//       cb(error);
//     }
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    try {
      const id = uuidv4();
      const filename = `${id}${path.extname(file.originalname)}`;
      cb(null, filename);
    } catch (error) {
      cb(error);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Attach file filter function
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB, adjust as needed
  },
});

module.exports = upload;
