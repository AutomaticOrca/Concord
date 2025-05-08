import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "@/lib/api/detail.ts";
import { MemberDto } from "@/types";
import { useAuth } from "@/context/AuthContext.tsx";
import { UserPen, MessagesSquare, ThumbsUp } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import SharedPhotos from "./SharedPhotos/SharedPhotos";

const Detail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();
  const [member, setMember] = useState<MemberDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showLookingFor, setShowLookingFor] = useState(false);
  const [showInterests, setShowInterests] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    getUser(username)
      .then(setMember)
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  }, [username]);

  const isCurrentUser = user?.username === member?.userName;

  const handleStartChat = () => {
    if (!member?.userName) return;
    navigate(`/chat/${member.userName}`);
  };

  const handleLike = () => {
    setLiked(true);
    setTimeout(() => setLiked(false), 800);
    console.log("Liked", member?.userName);
  };

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (!member) return <div className="p-4 text-red-500">User not found.</div>;

  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-scroll whitespace-normal break-words flex flex-col">
        {/* Profile header section */}
        <div className="border-b border-white/10 px-6 py-8">
          <div className="flex items-start gap-10">
            {/* Avatar and icons */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={member.photoUrl || "/avatar.png"}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover"
              />

              <div className="flex items-center gap-4">
                {!isCurrentUser && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleStartChat}
                      className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full text-sm font-medium transition"
                    >
                      <MessagesSquare className="w-4 h-4" />
                      Start Chat
                    </button>
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 border border-pink-500 text-pink-500 hover:bg-pink-50 rounded-full text-sm font-medium transition transform ${
                        liked ? "scale-110" : ""
                      }`}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${liked ? "animate-bounce" : ""}`}
                      />
                      {liked ? "Liked!" : "Like"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info section */}
            <div className="flex flex-col flex-1 gap-2">
              <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
                {member.knownAs}
                {member.age && (
                  <span className="text-base text-gray-600">
                    ({member.age})
                  </span>
                )}
                {isCurrentUser && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => navigate("/edit-profile")}>
                        <UserPen className="w-6 h-6 text-gray-600 hover:text-blue-500 hover:scale-110 transition cursor-pointer" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Edit Profile</TooltipContent>
                  </Tooltip>
                )}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {member.gender && <span>Gender: {member.gender}</span>}
                {member.city && member.country && (
                  <span>
                    Location: {member.city}, {member.country}
                  </span>
                )}
                {member.lastActive && (
                  <span>
                    Last Active:{" "}
                    {new Date(member.lastActive).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`text-gray-700 text-sm inline ${
                    showIntro ? "" : "line-clamp-2"
                  }`}
                >
                  {member.introduction ||
                    (isCurrentUser
                      ? "You haven't added an introduction yet."
                      : "This user hasn't shared anything yet.")}
                </p>
                {member.introduction && member.introduction.length > 100 && (
                  <button
                    onClick={() => setShowIntro(!showIntro)}
                    className="text-xs text-emerald-600 hover:underline ml-2"
                  >
                    {showIntro ? "Less" : "More"}
                  </button>
                )}
              </div>

              {member.lookingFor && (
                <div>
                  <p
                    className={`text-sm text-gray-700 inline ${
                      showLookingFor ? "" : "line-clamp-2"
                    }`}
                  >
                    <span className="font-medium">Looking for:</span>{" "}
                    {member.lookingFor}
                  </p>
                  {member.lookingFor.length > 100 && (
                    <button
                      onClick={() => setShowLookingFor(!showLookingFor)}
                      className="text-xs text-emerald-600 hover:underline ml-2"
                    >
                      {showLookingFor ? "Less" : "More"}
                    </button>
                  )}
                </div>
              )}

              {member.interests && (
                <div>
                  <p
                    className={`text-sm text-gray-700 inline ${
                      showInterests ? "" : "line-clamp-2"
                    }`}
                  >
                    <span className="font-medium">Interests:</span>{" "}
                    {member.interests}
                  </p>
                  {member.interests.length > 100 && (
                    <button
                      onClick={() => setShowInterests(!showInterests)}
                      className="text-xs text-emerald-600 hover:underline ml-2"
                    >
                      {showInterests ? "Less" : "More"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shared photos section */}
        <SharedPhotos
          photos={member.photos || []}
          isCurrentUser={isCurrentUser}
        />
      </div>
    </TooltipProvider>
  );
};

export default Detail;
