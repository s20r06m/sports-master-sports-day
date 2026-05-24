"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ROW_ID = "0aef1ed7-0c22-48bc-b41b-65fb77d08c75";

export default function LocationNavButton() {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const loadLocation = async () => {
      const { data } = await supabase
        .from("details")
        .select("location")
        .eq("id", ROW_ID)
        .single();

      setLocation(data?.location ?? null);
    };

    loadLocation();
  }, []);

  const navigate = () => {
    if (!location) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${location}`;
    window.open(url, "_blank");
  };

  const isDisabled = !location;

  return (
    <button
      onClick={navigate}
      disabled={isDisabled}
      className={`location-nav-button ${
        isDisabled ? "location-nav-button-disabled" : ""
      }`}
    >
      {isDisabled ? "Location not set yet" : "Navigate"}
    </button>
  );
}