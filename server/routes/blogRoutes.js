const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware"); 
const {
  createBlogValidator,
  updateBlogValidator,
} = require("../zodValidators/blogValidators"); 
const blogController = require("../controllers/blogController"); 

router.post("/create", auth, validate(createBlogValidator), blogController.createBlog);

router.get("/all", blogController.getAllBlogs); 

router.get("/myBlogs", auth, blogController.getMyBlogs); 

router.get("/:id", blogController.getBlogById);

router.put("/update/:id", auth, validate(updateBlogValidator), blogController.updateBlog);

router.delete("/delete/:id", auth, blogController.deleteBlog);

module.exports = router;