import { useState } from "react";
import { PhotoDto } from "@/types";
import {
  uploadPhoto,
  setMainPhoto,
  deletePhoto,
  getUser,
} from "@/lib/api/detail";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";

interface AvatarUploaderProps {
  photos: PhotoDto[];
  onPhotosUpdated: (photos: PhotoDto[]) => void;
}

const AvatarUploader = ({ photos, onPhotosUpdated }: AvatarUploaderProps) => {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const current = photos.find((p) => p.isMain);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      setUploading(true);
      const uploaded = await uploadPhoto(file);
      await setMainPhoto(uploaded.id);

      const oldMain = photos.find((p) => p.isMain && p.id !== uploaded.id);
      if (oldMain) {
        await deletePhoto(oldMain.id);
      }

      const updated = await getUser(user!.username);
      onPhotosUpdated(updated.photos || []);
      setUser((prev) =>
        prev ? { ...prev, photoUrl: updated.photoUrl } : null
      );
      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(
        "detail/edit profile/avatarUploader: update photo failed:",
        err
      );
      toast.error("Failed to update profile photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <div className="relative group">
        <img
          src={current?.url || "/avatar.png"}
          alt="profile avatar"
          className="w-28 h-28 rounded-full object-cover bg-white ring-2 ring-emerald-300 shadow-md transition"
        />

        {/* Hover overlay */}
        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
      </div>

      <p className="text-sm text-gray-600">
        Click to change your profile photo
      </p>
    </div>
  );
};

export default AvatarUploader;
