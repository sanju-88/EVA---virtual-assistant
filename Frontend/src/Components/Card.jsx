import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

function Card({ image }) {
  const {serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  return (
    <div
      className={`w-[80px] h-[130px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#030353ba] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer transition-shadow duration-300 hover:border-[#e2e2ff] ${
        selectedImage === image
          ? "border-[#e2e2ff] shadow-2xl shadow-blue-950"
          : ""
      }`}
      onClick={() => {setSelectedImage(image)
        setBackendImage(null);
        setFrontendImage(null);}
      }
    >
      <img
        src={image}
        className="h-full w-full object-cover rounded-2xl"
        alt="assistant"
      />
    </div>
  );
}

export default Card;