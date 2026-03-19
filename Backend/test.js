import axios from "axios";

const test = async () => {
  const res = await axios.post(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCmiePiCXtjZ51aqpUYVk9afVfmnZpc9rQ",
    {
      contents: [{ parts: [{ text: "hello" }] }]
    }
  );

  console.log(res.data);
};

test();