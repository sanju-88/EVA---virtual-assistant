import React, { useContext, useState } from 'react'
import bg from "../assets/bg-2.jpg"
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from "../context/UserContext.jsx";
import axios from 'axios';

function Signup() {

  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl,userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");

    } catch (error) {
      setUserData(null);
      if (error.response) {
        setErr(error.response.data.message);
        console.error("Signup error:", error.response.data);
      } else {
        setErr("Server not responding");
      }
      setLoading(false);
    }
  }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>

      <form
        className='w-[90%] h-[600px] max-w-[500px] bg-[#00000066] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] rounded-lg px-[30px]'
        onSubmit={handleSignup}
      >

        <h1 className='text-3xl text-white font-semibold text-center mt-10 mb-[30px]'>
          Register to <span className='text-blue-400'>virtual assistant</span>
        </h1>

        <input
          type="text"
          placeholder='Enter your name'
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder:text-gray-300 px-[20px] rounded-full text-[18px]'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder='Enter your email'
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder:text-gray-300 px-[20px] rounded-full text-[18px]'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className='w-full h-full outline-none px-[20px] placeholder:text-gray-300 bg-transparent'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {showPassword ? (
            <FaRegEyeSlash
              className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEyeSharp
              className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
              onClick={() => setShowPassword(true)}
            />
          )}

        </div>

        {err && <p className='text-red-600 text-[14px]'>{err}</p>}

        <button
          className='min-w-[150px] h-[60px] mt-[30px] bg-white text-black font-semibold rounded-full text-[18px] hover:bg-blue-600 transition duration-300'
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className='text-white text-[16px]'>
          Already have an account?{" "}
          <span className='text-blue-400 cursor-pointer' onClick={() => navigate("/signin")}>
            Login
          </span>
        </p>

      </form>

    </div>
  )
}

export default Signup;