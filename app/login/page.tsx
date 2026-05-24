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

  const handleLogin = async () => {
    if (!firstname || !lastname) return;

    setLoading(true);

    try {
      // 1. Check if user exists
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("firstname", firstname)
        .eq("lastname", lastname)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      let user;

      // 2. If user exists → log them in
      if (existingUser) {
        user = existingUser;

        localStorage.setItem("user", JSON.stringify(user));

        alert(`Welcome back! You are in ${user.house} house`);
        router.push("/leaderboard");
        return;
      }

      // 3. If user does NOT exist → create new user
      // get current users count
const { count } = await supabase
  .from("users")
  .select("*", { count: "exact", head: true });

const index = (count ?? 0) % houses.length;

const house = houses[index];

      const newUser = {
        userid: crypto.randomUUID(),
        firstname,
        lastname,
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
    <div>
      <h1>Login</h1>

      <input
        placeholder="First Name"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />

      <input
        placeholder="Last Name"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  );
}