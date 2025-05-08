import { useAuth } from "@/context/AuthContext.tsx";
import { logout } from "@/lib/api/auth.ts";
import { ImagePlus, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p className="p-5 text-gray-500">Loading user info...</p>;

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between px-5 py-4">
        <div
          className="flex items-center gap-5 cursor-pointer"
          onClick={() => navigate(`/user/${user.username}`)}
        >
          <img
            src={user.photoUrl || "/avatar.png"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/avatar.png";
            }}
            alt="user-avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold text-emerald-900">
            {user.knownAs || user.username}
          </h2>
        </div>
        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <ImagePlus
                className="w-6 h-6 text-gray-600 hover:text-fuchsia-500 hover:scale-110 transition cursor-pointer"
                onClick={() => navigate("/manage-photos")}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">Manage Photos</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <LogOut
                onClick={logout}
                className="w-6 h-6 text-gray-600 hover:text-red-500 hover:scale-110 transition cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">Logout</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UserInfo;
