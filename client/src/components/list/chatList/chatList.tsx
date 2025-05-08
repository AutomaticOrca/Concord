import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { getUserChats } from "@/lib/api/chatList";
import { ChatDto } from "@/types";
import { formatChatTime } from "@/components/utils/format.ts";

const ChatList = () => {
  const [chatList, setChatList] = useState<ChatDto[]>([]);
  const navigate = useNavigate();
  const { username: selectedUsername } = useParams();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await getUserChats();
        setChatList(data);
      } catch (err) {
        console.error("❌ Failed to load chat list", err);
      }
    };
    loadChats();
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Search + Discover */}
      <div className="flex items-center gap-5 px-5 py-4">
        <motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{
            scale: 1.05,
            transition: { type: "spring", stiffness: 100 },
          }}
          onClick={() => navigate("/discover")}
          className="bg-gradient-to-r from-green-100 to-teal-100 text-emerald-900 px-6 py-2 rounded-full font-semibold text-sm shadow-md backdrop-blur-sm transition-all hover:shadow-lg hover:scale-105"
        >
          ✨ Meet Someone New
        </motion.button>
      </div>

      {/* Chat List */}
      {chatList.map((chat) => (
        <div
          key={chat.chatPartnerUsername}
          className={`w-full flex gap-5 px-5 py-4 border-b border-white/10 cursor-pointer
            transition-all duration-200 hover:bg-white/10 hover:shadow-inner hover:backdrop-blur-sm
            ${
              selectedUsername === chat.chatPartnerUsername ? "bg-white/10" : ""
            }
          `}
          onClick={() => navigate(`/chat/${chat.chatPartnerUsername}`)}
        >
          <img
            src={chat.chatPartnerPhotoUrl || "/avatar.png"}
            alt={`${chat.chatPartnerUsername}-avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-center w-full">
              <span className="font-medium text-emerald-900 truncate">
                {chat.chatPartnerUsername}
              </span>
              <span className="text-xs text-gray-400">
                {chat.lastMessageTime
                  ? formatChatTime(chat.lastMessageTime)
                  : ""}
              </span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-sm text-gray-700 truncate max-w-full">
                {chat.lastMessage || "No message yet"}
              </span>
              {chat.unreadCount > 0 && (
                <span className="bg-green-400 text-white text-[10px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
