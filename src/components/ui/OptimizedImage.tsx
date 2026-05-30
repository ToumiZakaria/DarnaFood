"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  style,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        style={{
          ...style,
          background: "#F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className={className}
      >
        <ImageIcon size={32} color="#CBD5E1" />
      </div>
    );
  }

  return (
    <div
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
      }}
      className={className}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 300ms",
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#F1F5F9",
            animation: "pulse 1.5s ease infinite",
          }}
        />
      )}
    </div>
  );
}
