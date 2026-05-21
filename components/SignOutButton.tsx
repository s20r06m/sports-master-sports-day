"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("auth-changed"));

  window.location.href = "/login";
};

  return (
    <button className="signout-button" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}