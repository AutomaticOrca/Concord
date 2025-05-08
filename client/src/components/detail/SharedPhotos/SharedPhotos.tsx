import React from "react";
import { PhotoDto } from "@/types";
import { useNavigate } from "react-router-dom";

interface SharedPhotosProps {
  photos: PhotoDto[];
  isCurrentUser?: boolean;
}

const SharedPhotos: React.FC<SharedPhotosProps> = ({
  photos,
  isCurrentUser,
}) => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-8 border-t border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-emerald-800">
          📷 Shared Photos
        </h3>
        {isCurrentUser && (
          <button
            onClick={() => navigate("/manage-photos")}
            className="text-sm text-emerald-600 border border-emerald-300 px-3 py-1 rounded-full hover:bg-emerald-50 transition"
          >
            Manage Photos
          </button>
        )}
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-md shadow-sm border border-white/20"
            >
              <img
                src={photo.url || "/default-photo.png"}
                alt={`Photo ${photo.id}`}
                className="w-full h-40 object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No shared photos available.</p>
      )}
    </div>
  );
};

export default SharedPhotos;
