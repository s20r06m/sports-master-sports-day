"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ROW_ID = "0aef1ed7-0c22-48bc-b41b-65fb77d08c75";

export default function DetailsAdmin() {
  const [form, setForm] = useState({
    team1Name: "",
    team2Name: "",
    team3Name: "",
    team4Name: "",
    location: "",
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("details")
        .select("*")
        .eq("id", ROW_ID)
        .single();

      if (data) setForm(data);
    };

    load();
  }, []);

  const saveTeams = async () => {
    await supabase
      .from("details")
      .update({
        team1Name: form.team1Name,
        team2Name: form.team2Name,
        team3Name: form.team3Name,
        team4Name: form.team4Name,
      })
      .eq("id", ROW_ID);
  };

  const setLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    await supabase
      .from("details")
      .update({
        location: `${latitude},${longitude}`,
      })
      .eq("id", ROW_ID);
  });
};

const clearLocation = async () => {
  await supabase
    .from("details")
    .update({
      location: null,
    })
    .eq("id", ROW_ID);
};

  return (
      <div>
  <button className="event-admin-create" onClick={setLocation}>
    Set Location
  </button>

  <button className="event-admin-create"onClick={clearLocation}>
    Clear Location
  </button>
</div>
  );
}