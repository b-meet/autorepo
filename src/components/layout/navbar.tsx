"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Demo", href: "/demo" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <nav
      className={cn(
        "fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-between",
        isScrolled
          ? "top-4 w-[90%] max-w-5xl rounded-full border border-white/10 bg-black/60 shadow-lg shadow-violet-500/5 backdrop-blur-xl px-6 py-3"
          : "top-0 w-full max-w-none border-b border-transparent bg-transparent px-6 py-4"
      )}
    >
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="font-bold text-white">V</span>
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">Autorepo</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-white",
              pathname === link.href ? "text-white" : "text-white/60"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">
          Sign In
        </Link>
        <Link href="/register">
          <Button size="sm" className={cn("transition-all", isScrolled ? "h-9 px-4" : "")}>
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
}
