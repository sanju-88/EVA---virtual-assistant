import { useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signin from "./pages/SignIn.jsx";
import Signup from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import Customize from "./pages/Customize.jsx";
import Customize2 from "./pages/Customize2.jsx";
import { UserDataContext } from "./context/UserContext.jsx";

function App() {
  const { userData } = useContext(UserDataContext);

  return (
    <Routes>

      <Route
        path="/"
        element={
          !userData
            ? <Navigate to="/signin" />
            : userData.assistantName && userData.assistantImage
            ? <Home />
            : <Navigate to="/customize" />
        }
      />

      <Route
        path="/signin"
        element={!userData ? <Signin /> : <Navigate to="/" />}
      />

      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/" />}
      />

      <Route
        path="/customize"
        element={
          userData
            ? <Customize />
            : <Navigate to="/signin" />
        }
      />

      <Route
        path="/customize2"
        element={
          userData
            ? <Customize2 />
            : <Navigate to="/signin" />
        }
      />

    </Routes>
  );
}
export default App;
