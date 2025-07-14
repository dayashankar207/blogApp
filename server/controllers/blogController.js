const blogModel = require("../models/blogModel");

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = new blogModel({ title, content, user: req.user.id });
    await blog.save();
    res.status(201).json({ blog });
  } catch (err) {
    console.error("Error in createBlog controller:", err);
    res.status(500).json({ error: err.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate("user", "username email");
    res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error in getAllBlogs controller:", err);
    res.status(500).json({ error: err.message });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    // This explicitly gets blogs for the authenticated user
    const blogs = await blogModel.find({ user: req.user.id });
    res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error in getMyBlogs controller:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!blog)
      return res.status(404).json({ message: "Cannot delete blog, Not found" });

    res.status(200).json({ message: "Blog Deleted Successfully" });
  } catch (err) {
    console.error("Error in deleteBlog controller:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.content) updates.content = req.body.content;

    const blog = await blogModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: "Couldn't update blog" });

    res.status(200).json({ blog, message: "Blog updated successfully" });
  } catch (err) {
    console.error("Error in updateBlog controller:", err);
    res.status(500).json({ error: err.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await blogModel
      .findById(req.params.id)
      .populate("user", "username");

    if (!blog)
      return res.status(404).json({ message: "Not found, Cannot read blog" });

    res.status(200).json({ blog });
  } catch (err) {
    console.error("Error in getBlogById controller:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  deleteBlog,
  updateBlog,
  getBlogById,
};
