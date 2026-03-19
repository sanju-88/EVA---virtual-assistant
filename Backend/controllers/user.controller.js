import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import moment from "moment";
import geminiResponse from "../gemini.js";
import { json, response } from "express";

export const getCurrentUser = async (req, res) => {
  try {
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
    } else {
      assistantImage = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { returnDocument: "after" },
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("UPDATE ASSISTANT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ response: "User not found" });
    }
    const userName = user.name;
    const assistantName = user.assistantName;
    const { command } = req.body;

    console.log("🧠 Command:", command);

    const result = await geminiResponse(command, assistantName, userName);

    let gemResult;

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)?.[0];

      if (!jsonMatch) {
        throw new Error("No JSON found");
      }

      gemResult = JSON.parse(jsonMatch);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
      return res.json({
        type: "general",
        userInput: command,
        response: "Sorry, I didn't understand that.",
      });
    }

    const type = gemResult.type;

    console.log("🤖 Gemini result:", result);

    if (!gemResult || !gemResult.type) {
      return res.json({
        type: "general",
        userInput: command,
        response: "I couldn't understand that",
      });
    }

    switch (type) {
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `The current time is ${moment().format("hh:mm A")}`,
        });

      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today's date is ${moment().format("MMMM Do YYYY")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `This month is ${moment().format("MMMM")}`,
        });

      case "google_search":
      case "wikipedia_search":
      case "youtube_search":
      case "weather_info":
      case "joke":
      case "quote":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "twitter_open":
      case "facebook_open":
      case "linkedin_open":
      case "github_open":
      case "email_open":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res
          .status(400)
          .json({ response: "I didn't understand that command." });
    }
  } catch (error) {
    console.error(
      "FULL ERROR:",
      error.response?.data || error.message || error,
    );
    return res.status(500).json({ response: "Ask assistant error." });
  }
};
