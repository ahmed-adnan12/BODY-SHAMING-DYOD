import { useEffect, useState } from "react";
import HeroPage from "./pages/HeroPage";
import AdminPage from "./pages/AdminPage";
import { initTracker } from "./utils/tracker";

export function App() {
  const [page, setPage] = useState<"hero" | "admin">("hero");

  useEffect(() => {
    // Track every visitor and save to Firebase
    initTracker();
  }, []);

  if (page === "admin") {
    return <AdminPage onBack={() => setPage("hero")} />;
  }

  return <HeroPage onAdminClick={() => setPage("admin")} />;
}
