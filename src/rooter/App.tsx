import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Bookings from "../pages/dashboard/Bookings";
import Profile from "../pages/dashboard/Profile";
import DashboardHome from "../pages/dashboard/DashboardHome";
import  User  from "../pages/dashboard/Users";
import {HotelPage} from "../pages/Hotel";
import { DashboardHotel } from "../pages/dashboard/DashboardHotel";
import { AuthService } from "../services/Auth.service";

const App = () => {
  const PrivateRoute = () => {
    return !AuthService.isTokenExpired() ? <Outlet /> : <Navigate to="/signin" />;
  };
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/hotel" element={<HotelPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="hotel" element={<DashboardHotel />} />
            <Route path="user" element={<User />}/>
            <Route path="booking" element={<Bookings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
