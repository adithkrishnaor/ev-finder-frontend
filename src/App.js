import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import MapScreen from "./components/MapScreen";
import StationMasterSignUp from "./components/StationMasterSignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/stationSignUp" element={<StationMasterSignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
