"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

const LogoutButton = ({ className }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("[logout] Failed to revoke session");
      }
    } catch (error) {
      console.error("[logout] Unexpected error", error);
    } finally {
      setIsSubmitting(false);
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        "rounded-full bg-neutral-900 px-2 py-1 text-xs font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3",
        className
      )}
      aria-label="Log out"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Logging out…" : "Logout"}
    </button>
  );
};

export default LogoutButton;
