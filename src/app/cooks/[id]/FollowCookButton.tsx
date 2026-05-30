"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface FollowCookButtonProps {
  cookId: string;
  isCook: boolean;
}

export default function FollowCookButton({ cookId, isCook }: FollowCookButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("followed_cooks");
      if (stored) {
        try {
          const list: string[] = JSON.parse(stored);
          setIsFollowing(list.includes(cookId));
        } catch (e) {}
      }
    }
  }, [cookId]);

  const handleFollow = () => {
    if (isCook) {
      toast.error("Les cuisiniers ne peuvent pas suivre d'autres cuisiniers");
      return;
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("followed_cooks");
      let list: string[] = [];
      if (stored) {
        try {
          list = JSON.parse(stored);
        } catch (e) {}
      }

      if (isFollowing) {
        list = list.filter(id => id !== cookId);
        setIsFollowing(false);
        toast.success("Vous ne suivez plus ce cuisinier");
      } else {
        list.push(cookId);
        setIsFollowing(true);
        toast.success("Vous suivez maintenant ce cuisinier !");
      }

      localStorage.setItem("followed_cooks", JSON.stringify(list));
    }
  };

  return (
    <button
      onClick={handleFollow}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        height: 40,
        padding: "0 1.25rem",
        borderRadius: 12,
        border: `1.5px solid ${isFollowing ? "#EF4444" : "#E2E8F0"}`,
        background: isFollowing ? "#FEF2F2" : "white",
        color: isFollowing ? "#EF4444" : "#475569",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 150ms ease"
      }}
    >
      <Heart size={15} fill={isFollowing ? "#EF4444" : "none"} />
      {isFollowing ? "Suivi !" : "Suivre"}
    </button>
  );
}
