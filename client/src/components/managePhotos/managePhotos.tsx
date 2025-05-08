"use client";

import { useAuth } from "@/context/AuthContext";
import {
  getUser,
  uploadPhoto,
  deletePhoto,
  setMainPhoto,
} from "@/lib/api/detail";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PhotoDto } from "@/types";
import { Trash2, Star, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagePhotos = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      if (!user?.username) return;
      const updated = await getUser(user.username);
      setPhotos(updated.photos || []);
    };

    loadPhotos();
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || !user?.username) return;

    try {
      setUploading(true);
      await uploadPhoto(selectedFile);

      const updated = await getUser(user.username);
      setPhotos(updated.photos || []);
      setUser((prev) =>
        prev ? { ...prev, photoUrl: updated.photoUrl } : null
      );

      toast.success("Photo uploaded!");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("manage photos failed:", err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Photo deleted.");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSetMain = async (id: number) => {
    try {
      await setMainPhoto(id);
      const updated = await getUser(user!.username);
      setPhotos(updated.photos || []);
      setUser((prev) =>
        prev ? { ...prev, photoUrl: updated.photoUrl } : null
      );
      toast.success("Updated profile photo!");
    } catch {
      toast.error("Failed to set main photo");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full border-b border-white/20 bg-white/30 backdrop-blur-md px-6 py-3">
        <h2 className="text-xl font-semibold text-emerald-900 tracking-wide text-center sm:text-left">
          📸 Manage Your Photos
        </h2>
      </div>

      <div className="px-4">
        {/* Upload Preview or Upload Button */}
        <div className="w-full mb-4">
          {!previewUrl ? (
            <label className="w-full h-56 border-2 border-dashed border-emerald-300 rounded-md flex flex-col items-center justify-center text-emerald-600 text-sm cursor-pointer hover:bg-emerald-50 transition">
              <UploadCloud className="w-6 h-6 mb-1" />
              Click to upload photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-full h-56 rounded-md overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={handleConfirmUpload}
                  disabled={uploading}
                  className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-emerald-700"
                >
                  {uploading ? "Uploading..." : "Confirm Upload"}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="bg-white text-gray-700 px-4 py-1.5 rounded-full text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group overflow-hidden rounded-md"
            >
              <img
                src={photo.url}
                alt="photo"
                className="w-full h-32 object-cover"
              />
              {photo.isMain ? (
                <span className="absolute bottom-1 left-1 text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full shadow">
                  Profile Photo
                </span>
              ) : (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex justify-center items-center gap-4">
                  <button
                    onClick={() => handleSetMain(photo.id)}
                    className="bg-white text-emerald-600 px-2 py-1 rounded-full text-xs hover:bg-emerald-50"
                  >
                    <Star className="inline-block w-4 h-4 mr-1" />
                    Set as Profile
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="bg-white text-red-500 px-2 py-1 rounded-full text-xs hover:bg-red-50"
                  >
                    <Trash2 className="inline-block w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ✅ 替换底部返回按钮 */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(`/user/${user?.username}`)}
            className="text-sm text-emerald-700 hover:underline"
          >
            ← Back to profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePhotos;
