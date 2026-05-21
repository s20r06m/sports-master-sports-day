"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
    router.refresh();
  };

  return (
    <button className="signout-button" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}