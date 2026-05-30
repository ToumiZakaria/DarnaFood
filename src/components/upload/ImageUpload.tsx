"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploadProps {
  resourceType?: "dish" | "avatar" | "banner" | "chat" | "profile";
  entityId?: string;
  maxFiles?: number;
  existingImages?: Array<{ id: string; url: string; thumbnail?: string }>;
  onImagesChange?: (images: Array<{ id: string; url: string }>) => void;
}

export default function ImageUpload({
  resourceType = "dish",
  entityId,
  maxFiles = 5,
  existingImages = [],
  onImagesChange,
}: ImageUploadProps) {
  const [images, setImages] = useState(existingImages);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, deleteImage, isUploading } = useImageUpload();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    handleFiles(files);
    e.target.value = "";
  };

  const handleFiles = async (files: File[]) => {
    const remainingSlots = maxFiles - images.length;
    const toProcess = files.slice(0, remainingSlots);
    if (toProcess.length === 0) return;

    const newPreviews = toProcess.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setPreviews((prev) => [...prev, ...newPreviews]);

    for (const { file } of newPreviews) {
      const result = await upload(file, { resourceType, entityId });
      if (result) {
        setImages((prev) => {
          const updated = [...prev, { id: result.id, url: result.url, thumbnail: result.thumbnail }];
          onImagesChange?.(updated);
          return updated;
        });
      }
      setPreviews((prev) => prev.filter((p) => p.file !== file));
    }
  };

  const removeImage = async (imageId: string) => {
    const success = await deleteImage(imageId);
    if (success) {
      setImages((prev) => {
        const updated = prev.filter((img) => img.id !== imageId);
        onImagesChange?.(updated);
        return updated;
      });
    }
  };

  const removePreview = (preview: string) => {
    setPreviews((prev) => prev.filter((p) => p.preview !== preview));
    URL.revokeObjectURL(preview);
  };

  const canUpload = images.length + previews.length < maxFiles;

  return (
    <div>
      {canUpload && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: "relative",
            border: `2px dashed ${isDragging ? "#F97316" : "#E2E8F0"}`,
            borderRadius: 16,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            cursor: "pointer",
            background: isDragging ? "#FFF7ED" : "transparent",
            transition: "all 200ms",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDragging ? "#F97316" : "#FAEEDA",
              transition: "background 200ms",
            }}
          >
            <Upload size={24} color={isDragging ? "#FFFFFF" : "#F97316"} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>
              {isDragging ? "Déposez les images ici" : "Glissez-déposez ou cliquez"}
            </p>
            <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
              JPG, PNG, WEBP &bull; Max 5MB &bull; {maxFiles} max
            </p>
          </div>
        </div>
      )}

      {(images.length > 0 || previews.length > 0) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 12,
            marginTop: canUpload ? 16 : 0,
          }}
        >
          {images.map((image) => (
            <div
              key={image.id}
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 12,
                overflow: "hidden",
                background: "#F8FAFC",
              }}
            >
              <img
                src={image.thumbnail || image.url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={() => removeImage(image.id)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color="#EF4444" />
              </button>
            </div>
          ))}
          {previews.map((p) => (
            <div
              key={p.preview}
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 12,
                overflow: "hidden",
                background: "#F8FAFC",
              }}
            >
              <img
                src={p.preview}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader2 size={24} color="#F97316" style={{ animation: "spin 1s linear infinite" }} />
              </div>
              <button
                onClick={() => removePreview(p.preview)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color="#64748B" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length >= maxFiles && (
        <p style={{ fontSize: 12, color: "#64748B", textAlign: "center", marginTop: 12 }}>
          Maximum {maxFiles} images atteint
        </p>
      )}
    </div>
  );
}
