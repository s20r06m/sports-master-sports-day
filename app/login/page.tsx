"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(false);

  const houses = ["Red", "Blue", "Green", "Yellow"];

  // Normalise everything to uppercase for consistent matching
  const formatName = (name: string) => name.trim().toUpperCase();

  const handleLogin = async () => {
    if (!firstname || !lastname) return;

    setLoading(true);

    try {
      // 1. Normalise input
      const cleanFirstname = formatName(firstname);
      const cleanLastname = formatName(lastname);

      // 2. Check if user exists (case-insensitive because everything stored uppercase)
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("firstname", cleanFirstname)
        .eq("lastname", cleanLastname)
        .maybeSingle();

      if (error) throw error;

      // 3. If user exists → login
      if (existingUser) {
        localStorage.setItem("user", JSON.stringify(existingUser));

        alert(
          `Welcome back! You are in ${existingUser.house} house`
        );

        router.push("/leaderboard");
        return;
      }

      // 4. If user does NOT exist → create new user
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      const index = (count ?? 0) % houses.length;
      const house = houses[index];

      const newUser = {
        userid: crypto.randomUUID(),
        firstname: cleanFirstname,
        lastname: cleanLastname,
        role: "user",
        house,
        participationcount: 0,
        firstplacecount: 0,
        secondplacecount: 0,
        thirdplacecount: 0,
      };

      const { data: insertedUser, error: insertError } = await supabase
        .from("users")
        .insert(newUser)
        .select()
        .single();

      if (insertError) throw insertError;

      localStorage.setItem("user", JSON.stringify(insertedUser));

      alert(`New user created! You are in ${house} house`);

      router.push("/leaderboard");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        <p className="login-subtitle">
          Enter your name and your house will be assigned automatically
        </p>

        <div className="login-form">
          <input
  className="login-input"
  placeholder="First Name"
  value={firstname}
  maxLength={14}
  onChange={(e) =>
    setFirstname(
      e.target.value.toUpperCase().slice(0, 14)
    )
  }
/>

<input
  className="login-input"
  placeholder="Last Name"
  value={lastname}
  maxLength={14}
  onChange={(e) =>
    setLastname(
      e.target.value.toUpperCase().slice(0, 14)
    )
  }
/>

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}