"use client";

import LocationNavButton from "@/components/localNavButton";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ROW_ID = "0aef1ed7-0c22-48bc-b41b-65fb77d08c75";

type Details = {
  location: string | null;
  dateandtime: string | null;
};

export default function HomePage() {
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("details")
        .select("dateandtime")
        .eq("id", ROW_ID)
        .single();

      if (error) {
        console.error("Failed to load event date:", error);
        return;
      }

      if (data?.dateandtime) {
        setEventDate(new Date(data.dateandtime));
      }
    };

    load();

    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ⛔ prevent crash while loading
  if (!eventDate || !now) {
    return (
      <main className="home-container">
        <p style={{ textAlign: "center" }}>Loading...</p>
      </main>
    );
  }

  const diff = eventDate.getTime() - now.getTime();
  const isPast = diff <= 0;

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

  function addToCalendar() {
  if (!eventDate) return; // important guard

  const start = new Date(eventDate);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const format = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sports Day//EN
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${format(new Date())}
DTSTART:${format(start)}
DTEND:${format(end)}
SUMMARY:Sports Master's Sports Day
LOCATION:Pontcanna Fields, Cardiff
DESCRIPTION:Casual park games, friendly competition, and social sports day.
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "sports-day.ics";
  link.click();

  URL.revokeObjectURL(url);
}

  return (
    <main className="home-container">
      <ul className="home-list">

        {/* Hero */}
        <li style={{ textTransform: "uppercase", textAlign: "center" }}>
          <h2>Welcome to</h2>
          <p
            style={{
              letterSpacing: "4px",
              fontSize: "var(--text-hero)",
              fontWeight: 800,
            }}
          >
            Sports Master's Sports Day
          </p>
        </li>

        <p style={{ textAlign: "center" }}>
          Just an excuse to get out tbh. Casual park games, a bit of friendly competition,
          and catching up with people I haven’t seen in ages.
        </p>

        {/* Countdown */}
        <li className="home-card highlight">
          {isPast ? (
            <p className="big-text">🏁 Event in progress / completed</p>
          ) : (
            <>
              <h2>on</h2>

              <p
                style={{
                  letterSpacing: "4px",
                  fontSize: "var(--text-hero)",
                  fontWeight: 800,
                }}
              >
                {eventDate.toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).toUpperCase()}
              </p>

              <h2>at</h2>
              <p
                style={{
                  letterSpacing: "4px",
                  fontSize: "var(--text-hero)",
                  fontWeight: 800,
                }}
              >
                {eventDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <div className="countdown-grid">
                <div><span>{days}</span><small>Days</small></div>
                <div><span>{hours}</span><small>Hours</small></div>
                <div><span>{minutes}</span><small>Min</small></div>
                <div><span>{seconds}</span><small>Sec</small></div>
              </div>
              <button className="location-nav-button" onClick={addToCalendar}>
                Add to Calendar
              </button>
            </>
          )}
        </li>

        {/* Location */}
        <li className="home-card">
          <h2>Location</h2>
          <p className="big-text">Pontcanna Fields, Cardiff</p>
          <p className="muted">
            Exact venue details to be confirmed by closer to the event. Stay tuned!
          </p>
          <LocationNavButton />
        </li>

        {/* Footer */}
        <li>
          <p className="muted" style={{ textAlign: "center" }}>
            Compete in events. Earn points. Represent your house. Win glory.
          </p>
        </li>

      </ul>
    </main>
  );
}