"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ROW_ID = "0aef1ed7-0c22-48bc-b41b-65fb77d08c75";

type Details = {
  location: string | null;
  dateandtime: string | null;
};

export default function DetailsAdmin() {
  const [form, setForm] = useState<Details>({
    location: "",
    dateandtime: null,
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

  const updateField = (key: keyof Details, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const save = async () => {
    await supabase
      .from("details")
      .update({
        dateandtime: form.dateandtime,
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
      .update({ location: null })
      .eq("id", ROW_ID);
  };

  return (
    <div className="event-admin">
      
<div className="details-row">
  <input
    className="event-admin-create"
    type="datetime-local"
    value={form.dateandtime ? form.dateandtime.slice(0, 16) : ""}
    onChange={(e) => updateField("dateandtime", e.target.value)}
  />

  <button className="event-admin-create" onClick={save}>
    Save Details
  </button>
</div>

        <button className="event-admin-create" onClick={setLocation}>
          Set Location
        </button>

        <button className="event-admin-create" onClick={clearLocation}>
          Clear Location
        </button>
    </div>
  );
}