"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  // 🔧 Set your event date/time here
  const eventDate = new Date("2026-06-13T10:00:00Z");

  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const diff = now
    ? eventDate.getTime() - now.getTime()
    : 0;

  const isPast = diff <= 0;

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

return (
  <main className="home-container">
    <ul className="home-list">

      <li>
        <h1>Welcome to Sports Master</h1>
        <p className="muted">
          Your one-stop hub for all things sports day. Check out upcoming events, track your points, and see how your house stacks up!
        </p>
      </li>

      {/* Countdown */}
      <li className="home-card highlight">
        <h2>Countdown to Event</h2>

        {isPast ? (
          <p className="big-text">🏁 Event in progress / completed</p>
        ) : (
          <div className="countdown-grid">
            <div>
              <span>{days}</span>
              <small>Days</small>
            </div>
            <div>
              <span>{hours}</span>
              <small>Hours</small>
            </div>
            <div>
              <span>{minutes}</span>
              <small>Min</small>
            </div>
            <div>
              <span>{seconds}</span>
              <small>Sec</small>
            </div>
          </div>
        )}
      </li>

      {/* Location */}
      <li className="home-card">
        <h2>Location</h2>
        <p className="big-text">Sports Field</p>
        <p className="muted">
          Exact venue details to be confirmed by admin
        </p>
      </li>

      {/* Footer Info */}
      <li>
        <p className="muted">
          Compete in events. Earn points. Represent your house. Win glory.
        </p>
      </li>

    </ul>
  </main>
);
}