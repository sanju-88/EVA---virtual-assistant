import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const UserDataContext = createContext();


function UserContext({ children }) {
  const serverUrl = "https://virtual-assistant-backend-dezu.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });

      setUserData(result.data);
      console.log("Current user data:", result.data);
    } catch (error) {
      console.log("Error fetching current user data:", error);
    }
  };
  
const getGeminiResponse = async (command) => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      { command },
      { withCredentials: true }
    );

    return result.data;
  } catch (error) {
    console.error("FULL ERROR:", error);

    if (error.response) {
      console.error("BACKEND ERROR:", error.response.data);
    }

    return {
      type: "general",
      userInput: command,
      response: error.response?.data?.message || "Backend not responding",
    };
  }
};

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
