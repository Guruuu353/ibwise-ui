import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import PublicNav from "./PublicNav";
import Footer from "./Footer";
import ChatWidget from "../chat/ChatWidget";

export default function PublicLayout() {
  return (
    <div className="bg-paper text-ink font-body">
      <TopBar />
      <PublicNav />
      <Outlet />
      <Footer />
      <ChatWidget />
    </div>
  );
}
