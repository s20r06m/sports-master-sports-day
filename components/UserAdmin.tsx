"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  userid: string;
  firstname: string | null;
  lastname: string | null;
  house: string | null;
  role: string | null;
};

export default function UserAdmin() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase
        .from("users")
    .select("userid, firstname, lastname, house, role")
    .eq("role", "user"); // 👈 only normal users

      setUsers(data ?? []);
    };

    loadUsers();
  }, []);

  const deleteUser = async (userid: string) => {
    const confirmDelete = confirm("Delete this user?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("userid", userid);

    if (error) {
      alert("Failed to delete user");
      return;
    }

    setUsers((prev) => prev.filter((u) => u.userid !== userid));
  };

  return (
    <div className="user-admin">
      <ul className="event-admin-list">
        {users.map((user) => (
          <li key={user.userid} className="event-admin-card">
  <div className="user-admin-row">
    <div className="user-admin-info">
      <div className="user-admin-name">
        {user.firstname} {user.lastname}
      </div>
    </div>

    <button
      className="event-admin-delete"
      onClick={() => deleteUser(user.userid)}
    >
      Delete
    </button>
  </div>
</li>
        ))}
      </ul>
    </div>
  );
}