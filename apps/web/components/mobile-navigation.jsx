"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import LogoutButton from "./logout-button";
import { useCart } from "@/context/CartContext";

const MobileNavigation = ({ currentUser }) => {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleToggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        handleCloseMenu();
        buttonRef.current?.focus();
      }
    },
    [handleCloseMenu]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalStyle;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        handleCloseMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleCloseMenu]);

  const handleLinkClick = () => {
    handleCloseMenu();
  };

  const menuContent =
    isOpen && mounted ? (
      <>
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={handleCloseMenu}
        />
        <nav
          ref={menuRef}
          id="mobile-menu"
          className="fixed inset-y-0 right-0 z-[110] w-64 max-w-[85vw] overflow-hidden bg-white shadow-2xl md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
              <span className="text-sm font-semibold text-neutral-900">
                Menu
              </span>
              <button
                type="button"
                onClick={handleCloseMenu}
                className="rounded-full p-1 text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4">
              <Link
                href="/products"
                onClick={handleLinkClick}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                Products
              </Link>

              <Link
                href="/cart"
                onClick={handleLinkClick}
                className="relative flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                aria-label={`View cart with ${itemCount} item${
                  itemCount === 1 ? "" : "s"
                }`}
              >
                <span>Cart</span>
                <span
                  className="grid min-h-[1.5rem] min-w-[1.5rem] place-items-center rounded-full bg-neutral-900 px-2 text-xs font-semibold text-white"
                  aria-hidden="true"
                >
                  {itemCount}
                </span>
              </Link>

              {currentUser ? (
                <Link
                  href="/wishlist"
                  onClick={handleLinkClick}
                  prefetch={false}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  Wishlist
                </Link>
              ) : null}

              <Link
                href="/profile"
                onClick={handleLinkClick}
                prefetch={false}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                Profile
              </Link>
            </div>

            <div className="shrink-0 border-t border-neutral-200 bg-white px-3 py-4">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-neutral-50 px-3 py-2">
                    <span className="block text-xs font-medium text-neutral-500">
                      Logged in as
                    </span>
                    <span
                      className="block truncate text-sm font-semibold text-neutral-900"
                      title={currentUser.email}
                      aria-label={`Logged in as ${currentUser.email}`}
                    >
                      {currentUser.email}
                    </span>
                  </div>
                  <LogoutButton className="w-full" />
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="block w-full rounded-lg bg-neutral-900 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </>
    ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggleMenu}
        className="flex items-center justify-center rounded-full p-2 text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {mounted && menuContent && createPortal(menuContent, document.body)}
    </>
  );
};

export default MobileNavigation;
