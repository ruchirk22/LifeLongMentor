// src/components/ui/Avatar.tsx
import { useState, useEffect } from 'react';

interface AvatarProps {
  url: string | null;
  size?: number;
  onUpload: (file: File) => void;
  uploading: boolean;
}

export default function Avatar({
  url,
  size = 150,
  onUpload,
  uploading,
}: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) setAvatarUrl(url);
  }, [url]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full overflow-hidden"
        style={{ height: size, width: size }}
      >
        <img
          src={
            avatarUrl ||
            `https://placehold.co/${size}x${size}/374151/E0E7FF?text=No+Image`
          }
          alt="Avatar"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="mt-4">
        <label
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md cursor-pointer hover:bg-indigo-700"
          htmlFor="single"
        >
          {uploading ? 'Uploading...' : 'Upload Avatar'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUpload(e.target.files[0]);
            }
          }}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
