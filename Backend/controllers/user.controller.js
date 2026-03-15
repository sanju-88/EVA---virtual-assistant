import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.buffer);
      assistantImage = cloudinaryResult.secure_url;
      console.log("FILE:", req.file);
console.log("BODY:", req.body);
    } else {
      assistantImage = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage
      },
      { returnDocument: "after" }
    ).select("-password");

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("UPDATE ASSISTANT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
