"use client";

import { useEffect, useState } from "react";
import SignOutButton from "@/components/SignOutButton";

type StoredUser = {
  firstname: string;
  lastname: string;
  house?: string;
};

export default function CurrentUserBar() {
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

  if (!checkedStorage) return null;

  if (!user) return null;

  const houseClass = `house-${(user.house ?? "default")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className={`leaderboard-item current-user-bar ${houseClass}`}>
      <div className="user-summary">
        <div className="current-user-label">
          Currently Signed In
        </div>

        <div className="user-name">
          {user.firstname} {user.lastname}
        </div>
      </div>

      <SignOutButton />
    </div>
  );
}