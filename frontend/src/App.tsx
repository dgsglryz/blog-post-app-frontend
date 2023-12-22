import { Route, Routes } from "react-router-dom";

import LoginPage from "./features/login/LoginPage";
import SignupPage from "./features/signup/SignupPage";
import BlogPage from "./features/blog/BlogPage";
import LandingPage from "./features/landing/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/list" element={<BlogPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
