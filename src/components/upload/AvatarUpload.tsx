"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

interface AvatarUploadProps {
  currentAvatar?: string;
  userId: string;
  onAvatarChange?: (url: string) => void;
  size?: number;
}

export default function AvatarUpload({
  currentAvatar,
  userId,
  onAvatarChange,
  size = 120,
}: AvatarUploadProps) {
  const [avatar, setAvatar] = useState(currentAvatar);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await upload(file, {
      resourceType: "avatar",
      entityId: userId,
    });

    if (result) {
      setAvatar(result.url);
      onAvatarChange?.(result.url);
    }
  };

  return (
    <div
      style={{ display: "inline-block", position: "relative" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          background: "#FAEEDA",
          position: "relative",
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: size * 0.35,
              fontWeight: 700,
              color: "#F97316",
            }}
          >
            ?
          </div>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            opacity: isHovering && !isUploading ? 1 : 0,
            transition: "opacity 200ms",
          }}
        >
          <Camera size={24} color="#FFFFFF" />
          <span style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600, marginTop: 4 }}>
            Modifier
          </span>
        </button>

        {isUploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader2 size={28} color="#FFFFFF" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </div>
  );
}
