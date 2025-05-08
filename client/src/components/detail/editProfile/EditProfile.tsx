import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUser, getUser } from "@/lib/api/detail";
import { toast } from "sonner";
import { MemberUpdateDto, PhotoDto } from "@/types/user";
import AvatarUploader from "./AvatarUploader";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<MemberUpdateDto>({
    introduction: "",
    lookingFor: "",
    interests: "",
    city: "",
    country: "",
  });

  const [loading, setLoading] = useState(true);
  const [userPhotos, setUserPhotos] = useState<PhotoDto[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.username) return;
      try {
        const data = await getUser(user.username);
        setUserPhotos(data.photos || []);

        setFormData({
          introduction: data.introduction || "",
          lookingFor: data.lookingFor || "",
          interests: data.interests || "",
          city: data.city || "",
          country: data.country || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load user info:", err);
        toast.error("Failed to load user info.");
      }
    };

    loadUser();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user || !user.username) {
      toast.error("User details are not available. Unable to save changes.");
      return;
    }
    try {
      await updateUser(formData);
      toast.success("Profile updated!");
      navigate(`/user/${user.username}`);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Something went wrong.");
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="w-full border-b border-white/20 bg-white/30 backdrop-blur-md px-6 py-3">
        <h2 className="text-xl font-semibold text-emerald-900 tracking-wide text-center sm:text-left">
          📖 Edit Your Profile
        </h2>
      </div>

      <AvatarUploader photos={userPhotos} onPhotosUpdated={setUserPhotos} />

      {/* Form */}
      <div className="bg-white/50 backdrop-blur-xl shadow-lg rounded-b-xl px-8 py-6 space-y-6">
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Introduction
          </label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            rows={3}
            placeholder="Tell others a little bit about you..."
          />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Looking For
          </label>
          <input
            name="lookingFor"
            value={formData.lookingFor}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="What kind of people or vibe are you looking for?"
          />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Interests
          </label>
          <input
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="e.g., poetry, hiking, art..."
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium text-sm text-gray-700 mb-1">
              City
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium text-sm text-gray-700 mb-1">
              Country
            </label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        <div className="text-center pt-4 flex justify-center gap-4">
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition shadow-md"
          >
            Save Changes
          </button>
          <button
            onClick={() => {
              if (user && user.username) {
                navigate(`/user/${user.username}`);
              } else {
                toast.info("User information not found. Navigating to home.");
                navigate("/");
              }
            }}
            className="bg-white text-emerald-600 border border-emerald-600 px-6 py-2 rounded-full hover:bg-emerald-50 transition shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
