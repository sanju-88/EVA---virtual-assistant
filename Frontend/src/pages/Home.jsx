import { useContext, useRef, useState, useEffect } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);

  const [listening, setListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");

  const recognitionRef = useRef(null);
  const isSpeaking = useRef(false);
  const isRecognizing = useRef(false);

  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.error("Logout failed:", error);
    }
  };

  const startRecognition = () => {
    if (!recognitionRef.current || isSpeaking.current || isRecognizing.current)
      return;

    try {
      recognitionRef.current.start();
    } catch (err) {}
  };

  const speak = (text) => {
    if (!text) return;

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    isSpeaking.current = true;

    utterance.onend = () => {
      isSpeaking.current = false;
      startRecognition();
    };

    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    speak(response);

    const query = encodeURIComponent(userInput || "");

    if (type === "google_search") {
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }

    if (type === "weather_info") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }

    if (type === "youtube_search" || type === "youtube_play") {
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizing.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizing.current = false;
      setListening(false);

      setTimeout(() => {
        startRecognition();
      }, 1000);
    };

    recognition.onerror = () => {
      isRecognizing.current = false;
      setListening(false);

      setTimeout(() => {
        startRecognition();
      }, 1000);
    };

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      setTranscriptText(transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData?.assistantName?.toLowerCase())
      ) {
        try {
          recognition.stop();
          isRecognizing.current = false;
          setListening(false);

          const data = await getGeminiResponse(transcript);

          handleCommand(data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    startRecognition();

    return () => {
      recognition.stop();
      isRecognizing.current = false;
    };
  }, []);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#020236] flex justify-center items-center flex-col gap-[15px] relative">
      <button
        className="min-w-[150px] h-[55px] mt-[30px] 
hover:bg-white hover:text-blue-600 font-medium rounded-full text-[16px] 
bg-blue-700 text-white
shadow-md shadow-blue-500/20 
transition-all duration-500 cursor-pointer absolute top-[20px] right-[50px] px-[20px] py-[10px]"
        onClick={() => navigate("/customize")}
      >
        Customize your assistant
      </button>

      <button
        className="min-w-[150px] h-[55px] mt-[30px] 
hover:bg-white hover:text-blue-600 font-medium rounded-full text-[16px] 
bg-blue-700 text-white
shadow-md shadow-blue-500/20 
transition-all duration-500 cursor-pointer absolute top-[100px] right-[50px] px-[20px] py-[10px]"
        onClick={handleLogout}
      >
        Logout
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl border-2 border-[#03037bba]">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-2xl font-bold text-white mt-4">
        I'm{" "}
        <span className="text-blue-500">
          {userData?.assistantName?.charAt(0).toUpperCase() +
            userData?.assistantName?.slice(1)}
        </span>
      </h1>

      <p className="text-white text-lg mt-3 px-4 text-center">
        {transcriptText}
      </p>

      <p className="text-sm text-gray-400">
        {listening ? "Listening..." : "Idle"}
      </p>
    </div>
  );
}

export default Home;