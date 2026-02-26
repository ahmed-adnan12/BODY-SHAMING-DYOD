import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import HeroPage from "./pages/HeroPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
