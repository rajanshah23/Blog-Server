// const multer = require('multer');

// // Define storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads'); // no validation here
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Define file type filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true); // accept file
//   } else {
//     cb(new Error('Unsupported file type'), false); // reject file
//   }
// };

// // Create upload instance
// const upload = multer({ storage, fileFilter });

// module.exports = upload;
