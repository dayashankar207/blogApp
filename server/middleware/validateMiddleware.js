const { ZodError } = require("zod");

const validate =
  (schema, type = "body") =>
  (req, res, next) => {
    try {
      const result = schema.parse(req[type]);
      req[type] = result; // overwrite with parsed data
      next();
    } catch (err) {
      console.log("Validation middleware error:", err);
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.errors.map((e) => ({
            path: e.path[0],
            message: e.message,
          })),
        });
      }
      return res.status(500).json({ message: "Server error" });
    }
  };

module.exports = validate;
