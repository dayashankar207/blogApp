const { z } = require("zod");

const registerValidator = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
});

const loginValidator = z.object({
  email: z.email(),
  password: z.string().min(6),
});

module.exports = { registerValidator, loginValidator };
