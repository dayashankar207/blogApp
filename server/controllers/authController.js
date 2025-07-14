const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const user = new userModel({ username, email, password });
    await user.save();

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Error during registration:", err);
    res
      .status(500)
      .json({
        message: "Server error during registration",
        error: err.message,
      });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGOUT handler function
const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

const refreshToken = (req, res) => {
  res.json({ message: "Token refreshed (not implemented yet)" });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
