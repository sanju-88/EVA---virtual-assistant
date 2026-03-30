import React, { useContext, useState } from "react";
import bg from "../assets/bg.png";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true },
      );

      setUserData(result.data);

      setLoading(false);
      navigate("/");
    } catch (error) {
      setUserData(null);
      setLoading(false);

      if (error.response) {
        setErr(error.response.data.message);
      } else {
        setErr("Server not responding");
      }
    }
  };
  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[580px] max-w-[500px] 
bg-white/5 backdrop-blur-sm 
border border-white/10 
shadow-[0_8px_40px_rgba(0,0,0,0.6)] 
flex flex-col items-center justify-center gap-[22px] 
rounded-2xl px-[32px]"
        onSubmit={handleSignin}
      >
        <h1 className="text-3xl text-white font-semibold text-center mt-10 mb-[30px]">
          <span className="text-blue-400">Welcome </span>Back!
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder:text-gray-300 px-[20px] rounded-full text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="password"
            className="w-full h-full outline-none px-[20px] placeholder:text-gray-300 bg-transparent"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {showPassword ? (
            <FaRegEyeSlash
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEyeSharp
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {err && <p className="text-red-700 text-[14px]">{err}</p>}
        <button
          className="min-w-[150px] h-[55px] mt-[30px] 
hover:bg-white hover:text-blue-600 font-medium rounded-full text-[16px] 
bg-blue-700 text-white
shadow-md shadow-blue-500/20 
transition-all duration-500 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p
          className="text-white text-[16px]"
          onClick={() => navigate("/signup")}
        >
          Don't have an account?{" "}
          <span className="text-blue-300 hover:text-white hover:underline cursor-pointer">Sign up</span>
        </p>
      </form>
    </div>
  );
}

export default Signin;
