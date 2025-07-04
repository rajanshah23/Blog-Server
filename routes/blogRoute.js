const router = require("express").Router();
const blogController = require("../controller/blog/blogController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../services/catchAsync");
const upload = require("../services/multerConfig"); // now it's the actual multer middleware

router
  .route("/blog")
  .post(
    isAuthenticated,
    upload.single("image"),
    catchAsync(blogController.createBlog)
  )
  .get(catchAsync(blogController.getBlogs));

router
  .route("/blog/:id")
  .get(catchAsync(blogController.getSingleBlog))
  .delete(isAuthenticated, catchAsync(blogController.deleteBlog))
  .patch(
    isAuthenticated,
    upload.single("image"),
    catchAsync(blogController.updateBlog)
  );

module.exports = router;
