"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type StoredUser = {
  firstname?: string;
  lastname?: string;
  role?: string;
};

function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export default function Header() {
  const pathname = usePathname();

  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]); // 👈 THIS is the fix

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-title">
          <Link href="/">
            SM'S SPORTS DAY
          </Link>
        </div>

        <nav className="site-nav">
          <Link href="/" className="nav-link">Home</Link>

          {isLoggedIn && (
            <Link href="/events" className="nav-link">Events</Link>
          )}

                    {isLoggedIn && (
            <Link href="/draws" className="nav-link">Draws</Link>
          )}

          {isLoggedIn && (
            <Link href="/leaderboard" className="nav-link">Scores</Link>
          )}

          {!isLoggedIn && (
            <Link href="/login" className="nav-link">Login</Link>
          )}

          {isAdmin && (
            <Link href="/admin" className="nav-link">Admin</Link>
          )}
        </nav>
      </div>
    </header>
  );
}