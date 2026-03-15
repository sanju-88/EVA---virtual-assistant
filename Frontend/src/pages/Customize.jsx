import { useContext, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import Card from "../Components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
import image9 from "../assets/image9.png";
import image8 from "../assets/image8.png";
import image7 from "../assets/image7.png";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import { IoIosArrowBack } from "react-icons/io";

function Customize() {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col">
      <IoIosArrowBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => {
          if (userData?.assistantImage && userData?.assistantName) {
            navigate("/");
          } else {
            navigate("/signin");
          }
        }}
      />
      <h1 className="border-2 py-[5px] px-[20px] border-[#03037bba] rounded-xl text-white text-[20px] lg:text-[30px] mb-[40px] text-center ">
        Select your <span className="text-[#9c9cfe]">Assistant</span>
      </h1>
      <div className="w-[90%] max-w-[72%] flex justify-center items-center flex-wrap gap-[15px]">
        <Card image={image1} />
        <Card image={image8} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image2} />
        <Card image={image5} />
        <Card image={image7} />
        <Card image={image6} />
        <Card image={image9} />

        <div
          className={`w-[80px] h-[130px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#030353ba] rounded-2xl overflow-hidden hover:shadow-2xl hover-shadow-blue-950 cursor-pointer transition-shadow duration-300 hover-border-4 hover:border-[#9c9cfe] flex justify-center items-center ${
            selectedImage === "input"
              ? "border-[#e2e2ff] shadow-2xl shadow-blue-950"
              : ""
          }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <IoCloudUploadOutline className="text-[#9c9cfe] w-[20px] h-[20px] lg:w-[25px] lg:h-[25px]" />
          )}

          {frontendImage && (
            <img
              src={frontendImage}
              alt="custom"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button
          className="min-w-[120px] h-[40px] mt-[30px] bg-white text-black font-semibold rounded-full text-[18px] hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;
