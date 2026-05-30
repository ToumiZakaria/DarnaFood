"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  minWidth?: number;
  maxWidth?: number;
}

export default function DropdownMenu({
  trigger,
  children,
  align = "right",
  minWidth = 200,
  maxWidth = 320,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: align === "left" ? rect.left : 0,
        right: align === "right" ? window.innerWidth - rect.right : 0,
      });
    }
  }, [align]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => {
          updatePosition();
          setIsOpen((v) => !v);
        }}
      >
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <>
            <div
              className="dropdown-backdrop"
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
              }}
            />
            <div
              ref={dropdownRef}
              style={{
                position: "fixed",
                zIndex: 10000,
                top: `${position.top}px`,
                ...(align === "left"
                  ? { left: `${position.left}px` }
                  : { right: `${position.right}px` }),
                minWidth: `${minWidth}px`,
                maxWidth: `${maxWidth}px`,
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto",
                background: "white",
                borderRadius: 20,
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                border: "1px solid #E2E8F0",
                padding: "0.5rem",
                animation: "dropdownFadeIn 150ms ease",
              }}
            >
              {children}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
