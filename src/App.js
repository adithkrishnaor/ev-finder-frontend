import "./App.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import MapScreen from "./components/MapScreen";
import StationMasterSignUp from "./components/StationMasterSignUp";
import StationMasterLogin from "./components/StationMasterLogin";
import AddStation from "./components/AddStation";
import BookingForm from "./components/Booking";
import UserBookingHistory from "./components/UserBookingHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/stationSignUp" element={<StationMasterSignUp />} />
        <Route path="/stationLogin" element={<StationMasterLogin />} />
        <Route path="/addStation" element={<AddStation />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/userBookingHistory" element={<UserBookingHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
