import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData } = useContext(UserDataContext);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true
      });

      setUserData(null);
      navigate("/signin");

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#020236] flex justify-center items-center flex-col gap-[15px] relative">

      <button
        className="min-w-[150px] h-[60px] mt-[30px] bg-white text-black font-bold rounded-full text-[18px] hover:bg-blue-600 transition duration-300 absolute hover:text-white top-[20px] right-[20px] px-[20px] py-[10px] curson-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize your assistant
      </button>

      <button
        className="min-w-[150px] h-[60px] mt-[30px] bg-white text-black font-bold rounded-full text-[18px] hover:bg-blue-600 transition duration-300 hover:text-white absolute top-[100px] right-[20px] px-[20px] py-[10px] curson-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl border-2 border-[#03037bba] gap-[15px]">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="w-full h-full object-cover shadow-3xl shadow-blue-950"
        />
      </div>

      <h1 className="text-2xl font-bold text-white mt-4">
        I'm{" "}
        <span className="text-blue-500">
          {userData?.assistantName?.charAt(0).toUpperCase() +
            userData?.assistantName?.slice(1)}
        </span>
      </h1>

    </div>
  );
}

export default Home;