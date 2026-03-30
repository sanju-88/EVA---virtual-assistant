import { useContext, useRef, useState, useEffect } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { BiMenuAltLeft } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import "../index.css";

function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);

  const [listening, setListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);

  const isSpeaking = useRef(false);
  const isRecognizing = useRef(false);
  const recognitionRef = useRef(null);

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
    const recognition = recognitionRef.current;

    if (!recognition) return;
    if (isSpeaking.current) return;

    try {
      recognition.stop(); // reset (important)
    } catch {}

    try {
      recognition.start();
      console.log("🎤 Recognition started safely");
    } catch (err) {
      console.log("❌ Start error:", err);
    }
  };

  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";

    const voices = window.speechSynthesis.getVoices();

    const hindiVoice =
      voices.find((v) => v.lang === "hi-IN") ||
      voices.find((v) => v.lang === "en-IN");

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeaking.current = true;

    utterance.onend = () => {
      setAiText("");
      isSpeaking.current = false;
      setTimeout(startRecognition, 800);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    setAiText(response);
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
        "_blank",
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    // Load voices properly
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;
    let isMounted = true;

    const safeStart = () => {
      if (
        !recognitionRef.current ||
        isSpeaking.current ||
        isRecognizing.current
      )
        return;

      try {
        recognitionRef.current.start();
        console.log("🎤 Recognition started");
      } catch (err) {
        if (err.name !== "InvalidStateError") {
          console.log("Start error:", err);
        }
      }
    };

    // Greeting FIRST (avoid clash)
    if (userData?.name) {
      isSpeaking.current = true;

      const greeting = new SpeechSynthesisUtterance(
        `Hello ${userData.name}, what can I help you with?`,
      );
      greeting.lang = "hi-IN";

      greeting.onend = () => {
        isSpeaking.current = false;
        setTimeout(safeStart, 800);
      };

      window.speechSynthesis.speak(greeting);
    } else {
      setTimeout(safeStart, 1000);
    }

    recognition.onstart = () => {
      isRecognizing.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizing.current = false;
      setListening(false);

      setTimeout(() => {
        if (isMounted && !isSpeaking.current) {
          safeStart();
        }
      }, 1000);
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);

      isRecognizing.current = false;
      setListening(false);

      if (event.error !== "aborted" && isMounted && !isSpeaking.current) {
        setTimeout(safeStart, 1000);
      }
    };

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      // prevent unnecessary updates
      setTranscriptText((prev) => (prev === transcript ? prev : transcript));

      if (
        transcript
          .toLowerCase()
          .includes(userData?.assistantName?.toLowerCase())
      ) {
        try {
          setAiText("");
          setUserText(transcript);

          try {
            recognition.stop();
          } catch {}

          isRecognizing.current = false;
          setListening(false);

          const data = await getGeminiResponse(transcript);

          handleCommand(data);
          setUserText("");
        } catch (err) {
          console.error(err);
        }
      }
    };

    return () => {
      isMounted = false;

      try {
        recognition.stop();
      } catch {}

      isRecognizing.current = false;
      setListening(false);
    };
  }, []);

  return (
    <div className=" w-full h-[100vh] bg-gradient-to-t from-black to-[#020236] flex justify-center items-center flex-col gap-[15px] relative overflow-hidden">
      <BiMenuAltLeft
        className="text-white absolute top-[20px] left-[20px] w-[30px] h-[30px] z-50"
        onClick={() => setHam(true)}
      />

      <div
        className={`fixed top-0 left-0 h-screen 
  w-full lg:w-[370px]
  bg-gradient-to-b from-[#0b0b2a] to-[#050510] 
  border-r border-white/10 shadow-2xl
  backdrop-blur-lg p-[20px] 
  flex flex-col gap-[20px] items-start 
  transition-transform duration-500 z-50
  ${ham ? "translate-x-0" : "-translate-x-full"}`}
      >
        <RxCross2
          className="text-white absolute top-[20px] right-[20px] w-[30px] h-[30px]"
          onClick={() => setHam(false)}
        />

        <div className="flex flex-col gap-[10px] lg:hidden w-full items-start">
          <button
            className="hover:bg-blue-800 
hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] 
transition-all duration-300 cursor-pointer px-6 h-[55px] mt-[30px] bg-blue-700 text-white rounded-full"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            className="hover:bg-blue-800 
hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] 
transition-all duration-300 cursor-pointer px-6 h-[55px] bg-blue-700 text-white rounded-full"
            onClick={() => navigate("/customize")}
          >
            Customize your assistant
          </button>

          <div className="w-full h-[2px] bg-gray-400"></div>
        </div>

        <h1 className="text-white font-semibold text-[18px]">History</h1>

        <div className="custom-scroll w-full flex-1 overflow-y-auto flex flex-col gap-[10px] pr-1">
          {userData?.history?.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 hover:bg-white/10 transition p-3 rounded-xl text-sm text-white"
            >
              <p className="text-gray-300">👤 {item.user}</p>
              <p className="text-blue-300">🤖 {item.ai}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        className="hover:bg-blue-800 
hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] 
transition-all duration-300 cursor-pointer hidden lg:block px-6 h-[55px] m-[15px] absolute right-[50px] top-[70px] bg-blue-700 text-white rounded-full"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        className="hover:bg-blue-800 
hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] 
transition-all duration-300 cursor-pointer hidden lg:block px-6 h-[55px] absolute right-[50px] top-[20px] bg-blue-700 text-white rounded-full"
        onClick={() => navigate("/customize")}
      >
        Customize your assistant
      </button>
      <div className=" lg:w-[250px] lg:h-[350px] w-[200px] h-[300px] rounded-3xl border-2 border-[#03037bba] overflow-hidden">
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

      {!aiText && <img src={userImg} className="w-[200px]" />}
      {aiText && <img src={aiImg} className="w-[200px]" />}

      <h1 className="text-white text-lg mt-3 px-4 text-center">
        {userText || aiText || ""}
      </h1>
    </div>
  );
}

export default Home;
