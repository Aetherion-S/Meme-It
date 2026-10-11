"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ThemeToggleLogo } from "@/components/ThemeToggleLogo";
import { Menu, X, ExternalLink, Heart, Folder, Sparkles } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on Escape key press or click outside
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-border bg-background/80 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between relative">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggleLogo />
          <Link href="/" className="group flex items-center gap-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground transition-colors">
              Meme<span className="text-primary group-hover:opacity-80 transition-opacity">It</span>
            </h1>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-8 font-medium text-sm text-muted-foreground"
        >
          <a
            href="#categories"
            className="hover:text-foreground transition-colors hover:scale-105 active:scale-95 duration-150"
          >
            Category
          </a>
          <a
            href="https://giphy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors hover:scale-105 active:scale-95 duration-150"
          >
            Giphy
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
          <a
            href="#favorites"
            className="hover:text-foreground transition-colors hover:scale-105 active:scale-95 duration-150"
          >
            Favorites
          </a>
        </nav>

        {/* Right: Search Bar, Auth Buttons, & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {/* Expandable Search Input */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Search memes..."
              aria-label="Search memes"
              className="h-9 w-9 pl-9 pr-3 text-sm rounded-full bg-muted border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-ring hover:w-36 focus:w-44 sm:hover:w-48 sm:focus:w-48 [&:not(:placeholder-shown)]:w-36 sm:[&:not(:placeholder-shown)]:w-48 transition-all duration-300 ease-out text-foreground placeholder:text-transparent hover:placeholder:text-muted-foreground focus:placeholder:text-muted-foreground [&:not(:placeholder-shown)]:placeholder:text-muted-foreground cursor-pointer focus:cursor-text"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-foreground text-background px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-full bg-muted hover:bg-muted/80 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      <div
        id="mobile-navigation-menu"
        ref={menuRef}
        aria-hidden={!isMobileMenuOpen}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-border bg-background/95 backdrop-blur-2xl ${
          isMobileMenuOpen ? "max-h-[400px] opacity-100 py-4 shadow-xl" : "max-h-0 opacity-0 py-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-6 flex flex-col space-y-4">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            <a
              href="#categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Folder className="h-4 w-4 text-primary" />
              <span>Category</span>
            </a>
            <a
              href="https://giphy.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Giphy</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
            <a
              href="#favorites"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Heart className="h-4 w-4 text-primary" />
              <span>Favorites</span>
            </a>
          </nav>

          <div className="h-px bg-border my-1" />

          {/* Mobile Auth Actions */}
          <div className="flex flex-col space-y-2 pt-1 pb-2">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center text-sm font-medium py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center text-sm font-medium py-2.5 rounded-xl bg-foreground text-background hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
