"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";

interface UploadOptions {
  resourceType?: "dish" | "avatar" | "banner" | "chat" | "profile";
  entityId?: string;
}

interface UploadResult {
  id: string;
  url: string;
  thumbnail?: string;
  medium?: string;
  large?: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(
    async (file: File, options: UploadOptions = {}): Promise<UploadResult | null> => {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("resourceType", options.resourceType || "dish");
        if (options.entityId) {
          formData.append("entityId", options.entityId);
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data = await response.json();
        toast.success("Image téléchargée avec succès");
        return data.image;
      } catch (error: any) {
        toast.error(error.message || "Erreur lors du téléchargement");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const deleteImage = useCallback(async (imageId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/upload/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Delete failed");
      }

      toast.success("Image supprimée");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
      return false;
    }
  }, []);

  return { upload, deleteImage, isUploading };
}
