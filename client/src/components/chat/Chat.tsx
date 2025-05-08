import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EmojiClickData } from "emoji-picker-react";
import EmojiPicker from "emoji-picker-react";
import { Info } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";

const Chat = () => {
  const { username } = useParams<{ username: string }>(); // 明确类型
  const navigate = useNavigate();
  const { user } = useAuth(); // 假设 user 对象包含 token, 例如 user.token
  const {
    chatPartner,
    messages,
    isLoading,
    error, // Use error state from context
    loadChat,
    sendMessage,
    disconnectChat, // Get disconnect function
  } = useChat();

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  // Effect to load chat data when the username parameter changes
  useEffect(() => {
    if (username) {
      console.log(
        `Chat Component: Username changed to ${username}. Calling loadChat.`
      );
      loadChat(username);
    }

    // Cleanup: Optionally disconnect when the component unmounts
    // or when the username becomes undefined. Adjust based on desired behavior.
    return () => {
      console.log(
        `Chat Component: Unmounting or username changed from ${username}.`
      );
      // Decide if you want to automatically disconnect when leaving the chat page:
      // disconnectChat();
      // Or rely on ChatProvider cleanup/next loadChat call
    };
  }, [username, loadChat, disconnectChat]);

  // Effect for scrolling to the bottom
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Handler for Emoji picker
  const handleEmoji = (e: EmojiClickData) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  // Handler for sending message (uses context action)
  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await sendMessage(text); // Call the context function
      setText(""); // Clear input on successful call (context handles actual send)
    } catch (err) {
      // Error is likely already set in context, but you could add local feedback
      console.error("Error calling sendMessage from component", err);
    }
  };

  // --- Render Logic ---

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col flex-[2] min-w-[300px] border-x border-white/20 h-full items-center justify-center">
        <div className="text-gray-400">Loading chat...</div>
        {/* Optional: Add a spinner */}
      </div>
    );
  }

  // Error State (Displaying context error)
  if (error && !chatPartner) {
    // Show error prominently if loading failed completely
    return (
      <div className="flex flex-col flex-[2] min-w-[300px] border-x border-white/20 h-full items-center justify-center text-red-400">
        <p>Error loading chat:</p>
        <p>{error}</p>
        {/* You might want a retry button here */}
      </div>
    );
  }

  // No chat partner loaded (e.g., initial state before loading or after error)
  // Could refine this state depending on UX requirements
  if (!chatPartner) {
    return (
      <div className="flex flex-col flex-[2] min-w-[300px] border-x border-white/20 h-full items-center justify-center text-gray-400">
        Select a user to start chatting or check connection status.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-[2] min-w-[300px] border-x border-white/20 h-full">
      {/* Top Bar */}
      <div className="p-5 flex items-center justify-between border-b border-white/20">
        <div className="flex items-center gap-5">
          <img
            src={chatPartner.photoUrl || "/avatar.png"}
            alt="avatar"
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold">{chatPartner.userName}</span>
            <span className="text-sm text-white/60">
              {chatPartner.knownAs} from {chatPartner.city}
            </span>
          </div>
        </div>
        <Info
          className="w-7 h-7 text-white/80 hover:text-white cursor-pointer"
          onClick={() => navigate(`/user/${username}`)}
        />
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-5 p-5 flex-1 overflow-y-scroll custom-scrollbar">
        {messages.map((msg) => {
          const isOwn =
            msg.senderUsername.toLowerCase() === user?.username.toLowerCase();
          return (
            <div
              key={msg.id}
              className={`max-w-[70%] flex gap-5 ${
                isOwn ? "self-end flex-row-reverse" : ""
              }`}
            >
              <img
                src={msg.senderPhotoUrl || "/avatar.png"}
                alt="sender"
                className="w-[30px] h-[30px] rounded-full object-cover"
              />
              <div className="flex flex-col items-start gap-1">
                <p
                  className={`p-5 rounded-xl text-left ${
                    isOwn ? "bg-blue-500 text-white" : "bg-white/10 text-white"
                  }`}
                >
                  {msg.content}
                </p>
                <span className="text-xs text-white/70">
                  {new Date(msg.messageSent).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={endRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-5 flex items-center justify-between border-t border-white/20 gap-5">
        <div className="flex gap-5">
          <img src="/img.png" alt="img" className="w-5 h-5 cursor-pointer" />
          <img
            src="/camera.png"
            alt="camera"
            className="w-5 h-5 cursor-pointer"
          />
          <img src="/mic.png" alt="mic" className="w-5 h-5 cursor-pointer" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-white/10 text-white px-5 py-4 rounded-lg text-base outline-none"
        />
        <div className="relative">
          <img
            src="/emoji.png"
            alt="emoji"
            onClick={() => setOpen((prev) => !prev)}
            className="w-5 h-5 cursor-pointer"
          />
          {open && (
            <div className="absolute bottom-[50px] left-0 z-50">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
