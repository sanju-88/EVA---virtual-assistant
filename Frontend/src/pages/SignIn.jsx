import React, { useContext, useState } from 'react'
import bg from "../assets/bg-2.jpg"
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/userContext.jsx';
import axios from 'axios';


function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[loading,setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, { email, password }, { withCredentials: true });
      console.log(result);
    setLoading(false);

      navigate("/");
    } catch (error) {
  if (error.response) {
    setLoading(false);
    setErr(error.response.data.message);
  } else {
    setErr("Server not responding");
  }
}
  }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000066] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] rounded-lg px-[30px]' onSubmit={handleSignin}>

        <h1 className='text-3xl text-white font-semibold text-center mt-10 mb-[30px]'><span className='text-blue-400'>Welcome </span>Back!</h1>

        <input type="email" name='email' placeholder='Enter your email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder:text-gray-300 px-[20px] rounded-full text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email} />

        <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>

          <input
            type={showPassword ? "text" : "password"}
            name='password'
            placeholder="password"
            className='w-full h-full outline-none px-[20px] placeholder:text-gray-300 bg-transparent' required onChange={(e) => setPassword(e.target.value)} value={password}
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

        {err && <p className='text-red-700 text-[14px]'>{err}</p>}
        <button className='min-w-[150px] h-[60px] mt-[30px] bg-white text-black font-semibold rounded-full text-[18px] hover:bg-blue-600 transition duration-300' disabled={loading}>
         { loading ? "Signing In..." : "Sign In" }
        </button>

        <p className='text-white text-[16px]' onClick={() => navigate("/signup")}>
          Don't have an account? <span className='text-blue-400 cursor-pointer'>Sign up</span>
        </p>
      </form>
    </div>
  )
}

export default Signin