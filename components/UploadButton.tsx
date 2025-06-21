'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

interface UploadButtonProps {
  onUpload: (url: string) => void;
}

export default function UploadButton({ onUpload }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!} // ✅ use unsigned preset
      options={{
        sources: ['local', 'camera', 'url'],
        multiple: false,
        maxFiles: 1,
        folder: 'inventory-products', // optional folder in Cloudinary
      }}
      onUpload={(result) => {
        const info = result?.info as { secure_url?: string };
        if (info?.secure_url) {
          onUpload(info.secure_url);
        }
        setUploading(false);
      }}
      onOpen={() => setUploading(true)}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open?.()}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      )}
    </CldUploadWidget>
  );
}
