import { MessagesSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MemberDto } from "@/types/user";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: MemberDto;
}

const UserCard = ({ user }: UserCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/${user.userName}`);
  };

  const handleStartChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chat/${user.userName}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="flex flex-col items-center justify-center w-40 min-h-[190px] bg-white/10 rounded-3xl text-center backdrop-blur-md shadow-md hover:shadow-lg transition-all cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Avatar className="h-20 w-20 my-2 shadow-md">
        <AvatarImage src={user.photoUrl} alt={user.userName} />
        <AvatarFallback>{user.userName[0]}</AvatarFallback>
      </Avatar>

      <div className="text-lg font-semibold text-emerald-900">
        {user.knownAs}
      </div>
      <div className="text-sm text-emerald-700 min-h-[36px]">
        {user.city}, {user.country}
      </div>
      <button
        onClick={handleStartChat}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100/30 text-emerald-800 rounded-full hover:bg-emerald-300/50 transition-all text-sm font-medium shadow-sm min-h-[30px] min-w-[120px]"
      >
        <MessagesSquare className="h-4 w-4" />
        Start a Chat
      </button>
    </motion.div>
  );
};

export default UserCard;
