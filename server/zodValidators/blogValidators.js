const { z } = require("zod");

const createBlogValidator = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const updateBlogValidator = z
  .object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
  })
  .partial();

module.exports = { createBlogValidator, updateBlogValidator };
