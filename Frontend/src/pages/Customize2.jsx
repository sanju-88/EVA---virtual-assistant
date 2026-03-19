import React, { useState, useContext } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(UserDataContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || "",
  );

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("assistantName", assistantName);
      if (backendImage) {
        formdata.append("assistantImage", backendImage);
      } else {
        formdata.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formdata,
        { withCredentials: true },
      );
      setLoading(false);
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.error("Error updating assistant:", error);
    } 
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col">
      <IoIosArrowBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/customize")}
      />
      <h1 className="border-2 py-[5px] px-[20px] border-[#03037bba] rounded-xl text-white text-[20px] lg:text-[30px] mb-[40px] text-center">
        Enter your <span className="text-[#9c9cfe]">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="Example : Eva..."
        className="w-full h-[60px] max-w-[500px] outline-none border-2 border-[#eeeeeeba] px-[20px] ml-[20px] mr-[20px] text-white placeholder:text-gray-400 bg-transparent rounded-xl"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className="min-w-[150px] h-[55px] mt-[30px]  px-[20px] hover:bg-white hover:text-blue-600 font-medium rounded-full text-[16px] 
bg-blue-700 text-white
shadow-md shadow-blue-500/20 
transition-all duration-500 cursor-pointer"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Finally create your assistant..." : "Loading..."}
        </button>
      )}
    </div>
  );
}

export default Customize2;
