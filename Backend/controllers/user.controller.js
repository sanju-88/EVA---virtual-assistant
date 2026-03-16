import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import moment  from "moment";

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


export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({response: "Sorry, I couldn't understand that. Could you please rephrase?"});
    }

    const genResult = JSON.parse(jsonMatch[0]);
    const type = genResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: genResult.userInput, 
          response: `Today's date is:  ${moment().format("MMMM Do YYYY")}`});
        break;

      case "get_time":
         return res.json({
          type,
          userInput: genResult.userInput, 
          response: `The current time is:  ${moment().format("hh:mm A")}`});
        break;

      case "get_day":
          return res.json({
            type,
            userInput: genResult.userInput, 
            response: `Today is:  ${moment().format("dddd")}`});
          break;
      case "get_month":
            return res.json({
              type,
              userInput: genResult.userInput, 
              response: `This month is:  ${moment().format("MMMM")}`});
            break;    

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
            userInput: genResult.userInput, 
            response: genResult.response
           }); 
      default:
        return res.status(400).json({response: "Sorry, I couldn't understand that command."});
    }

  } catch (error) {
    console.error("Error asking to assistant:", error);
    return res.status(500).json({response: "Sorry, I encountered an error. Please try again."});
  }
}