"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SuggestEvent() {
  const [eventname, setEventname] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!eventname.trim()) return;

    setLoading(true);

    await supabase.from("events").insert({
      eventname: eventname.trim(),
      suggested: true,
      completed: false,
      participants: [],
      firstplaceuserids: [],
      secondplaceuserids: [],
      thirdplaceuserids: [],
    });

    setEventname("");
    setLoading(false);

    window.location.reload(); // simple refresh approach
  };

  return (
    <div className="suggest-event">
      <div className="suggest-row">
        <input
          className="event-admin-create"
          placeholder="Enter event name..."
          value={eventname}
          onChange={(e) => setEventname(e.target.value)}
        />

        <button
          className="event-admin-create"
          onClick={submit}
          disabled={loading}
        >
          Submit
        </button>
      </div>
    </div>
  );
}