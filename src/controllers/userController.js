import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// create a new user

export const createUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    return res.status(200).json({
      status: "success",
      message: "your account was created successfully!",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// login a user

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      return res.status(200).json({
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        }),
        status: "success",
        user,
      });
    } else {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get user by id

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// update user by id

export const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// delete user by id

export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "user deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
