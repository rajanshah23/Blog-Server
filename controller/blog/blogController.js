const Blog = require("../../model/blogModel");
const fs = require("fs");

class BlogController {
  // CREATE BLOG

  async createBlog(req, res) {
    console.log("🔥 createBlog called");
  console.log("📦 req.body:", req.body);
  console.log("🖼️ req.file:", req.file);
  console.log("👤 req.userId:", req.userId);
    try {
      const { title, subtitle, description, category } = req.body;
      const userId = req.userId;

      if (!title || !subtitle || !description || !category) {
        return res.status(400).json({
          message: "Please provide title, subtitle, description, and category",
        });
      }

    let imageUrl;
    if (req.file && req.file.path) {
      // multer-storage-cloudinary puts uploaded image URL in req.file.path
      imageUrl = req.file.path;
    } else {
      imageUrl ="https://imgs.search.brave.com/0FDP6A6kUjg7NYrfsZk1wUKN_rOvuUL2p41IeDhHroY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTIy/NzQ1MTkwL3Bob3Rv/L2Jsb2dnaW5nLWJs/b2ctY29uY2VwdHMt/aWRlYXMtd2l0aC13/b3JrdGFibGUuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPXhS/MnZPbXRnLU42TG82/X0kyNjlTb001UFhF/VlJ4bGd2S3hYVUJN/ZU1DX0E9"
     }

      const newBlog = await Blog.create({
        title,
        subtitle,
        description,
        category,
        userId,
        imageUrl,
      });

      return res.status(201).json({
        message: "Blog Created Successfully",
        data: newBlog,
      });
    } catch (error) {
      console.error("Error in createBlog:", error);
      return res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }

  // GET ALL BLOGS
  async getBlogs(req, res) {
    try {
      const data = await Blog.find().populate("userId", "-password");
      return res.status(200).json({
        message: "Blogs fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error in getBlogs:", error);
        console.error(error.stack);  
      return res.status(500).json({ message: error.message });
    }
  }

  // GET SINGLE BLOG
  async getSingleBlog(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({
          message: "Please provide id",
        });
      }

      const data = await Blog.findById(id).populate("userId", "-password");

      return res.status(200).json({
        message: "Blog fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error in getSingleBlog:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // DELETE BLOG
async deleteBlog(req, res) {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!id) {
      return res.status(400).json({ message: "Please provide blog ID" });
    }

    const blog = await Blog.findById(id).populate("userId");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.userId) {
      return res.status(403).json({ message: "This blog has no associated author" });
    }

    // Ensure both userId and blog.userId._id are strings for comparison
    const blogAuthorId = blog.userId._id?.toString();
    const currentUserId = userId?.toString();

    if (blogAuthorId !== currentUserId) {
      return res.status(403).json({ message: "You are not the author" });
    }

    // Delete blog image file if exists and not external
    if (blog.imageUrl && !blog.imageUrl.startsWith("http")) {
      const existingImagePath = blog.imageUrl.split("/uploads/")[1];
      if (existingImagePath) {
        fs.unlink(`uploads/${existingImagePath}`, (err) => {
          if (err) {
            console.log("Error deleting blog image:", err);
          } else {
            console.log("Blog image deleted successfully");
          }
        });
      }
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}



  // UPDATE BLOG
  async updateBlog(req, res) {
    try {
      const userId = req.userId;
      const id = req.params.id;
      const { title, description, category, subtitle } = req.body;

      const oldData = await Blog.findById(id).populate("userId");

      if (!oldData.userId.equals(userId)) {
        return res.status(403).json({
          message: "You are not the author",
        });
      }

      let fileName = oldData.imageUrl;

      if (req.file) {
        // Delete old image file if exists and not default image url
        if (oldData.imageUrl && !oldData.imageUrl.startsWith("http")) {
          const existingImagePath = oldData.imageUrl.split('/uploads/')[1];
          if (existingImagePath) {
            fs.unlink(`uploads/${existingImagePath}`, (err) => {
              if (err) {
                console.log("Error deleting old image:", err);
              } else {
                console.log("Old image deleted successfully");
              }
            });
          }
        }

        fileName = process.env.BASE_URL + "uploads/" + req.file.filename;
      }

      await Blog.findByIdAndUpdate(id, {
        title,
        description,
        category,
        subtitle,
        imageUrl: fileName,
      });

      return res.status(200).json({
        message: "Blog Updated Successfully",
      });
    } catch (error) {
      console.error("Error in updateBlog:", error);
      return res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }
}

module.exports = new BlogController();
