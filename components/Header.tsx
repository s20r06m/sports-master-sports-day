"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StoredUser = {
  firstname?: string;
  lastname?: string;
  role?: string;
};

export default function Header() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");

    if (raw) {
      setUser(JSON.parse(raw));
    } else {
      setUser(null);
    }

    setCheckedStorage(true);
  }, []);

  if (!checkedStorage) {
    return null;
  }

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-title">
          SM'S SPORTS DAY
        </div>

        <nav
          aria-label="Primary navigation"
          className="site-nav"
        >
          <Link href="/" className="nav-link">
            Home
          </Link>

          {isLoggedIn && (
            <Link href="/events" className="nav-link">
              Events
            </Link>
          )}

          {isLoggedIn && (
            <Link href="/leaderboard" className="nav-link">
              Leaderboard
            </Link>
          )}

          {!isLoggedIn && (
            <Link href="/login" className="nav-link">
              Login
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin" className="nav-link">
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}