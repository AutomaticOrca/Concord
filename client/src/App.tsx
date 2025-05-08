import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import List from "./components/list/List.tsx";
import Chat from "./components/chat/Chat.tsx";
import Detail from "@/components/detail/detail.tsx";
import Discover from "./components/discover/Discover.tsx";
import Auth from "@/components/auth/Auth.tsx";
import Notification from "./components/notification/Notification.tsx";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext.tsx";
import EditProfile from "./components/detail/editProfile/EditProfile.tsx";
import ManagePhotos from "./components/managePhotos/managePhotos.tsx";
import { ChatProvider } from "./context/ChatContext.tsx";

const Layout = () => {
  return (
    <div className="container">
      <div className="flex h-full">
        <div className="w-[300px] shrink-0 overflow-y-auto border-r">
          <List />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="discover" element={<Discover />} />
            <Route path="user/:username" element={<Detail />} />
            <Route path="chat/:username" element={<Chat />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="manage-photos" element={<ManagePhotos />} />
            <Route path="*" element={<Navigate to="/discover" />} />
          </Routes>
        </div>
      </div>
      <Notification />
      <Toaster />
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  return <BrowserRouter>{user ? <Layout /> : <Auth />}</BrowserRouter>;
};

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}
