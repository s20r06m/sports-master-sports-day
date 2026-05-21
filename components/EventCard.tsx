"use client";

import { useState } from "react";

type User = {
  userid: string;
  firstname: string | null;
  lastname: string | null;
};

type EventCardProps = {
  eventid: string;
  eventname: string;
  participants: string[];
  firstplace: string | null;
  secondplace: string | null;
  thirdplace: string | null;
  users: User[];
};

export default function EventCard({
  eventid,
  eventname,
  participants,
  firstplace,
  secondplace,
  thirdplace,
  users,
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const userMap = new Map(users.map((user) => [user.userid, user]));
  const participantsList = participants ?? [];

  const getUsername = (userid: string | null) => {
    if (!userid) return "—";
    const user = userMap.get(userid);
    if (!user) return "Unknown";
    return `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();
  };

  return (
    <li className="event-card" key={eventid}>
      <button
        className="event-card-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="event-card-header">
          <div className="event-name">{eventname}</div>
          <span className={`event-arrow ${isExpanded ? "expanded" : ""}`}>
            ▶
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="event-card-details">
          <div className="event-detail-section">
            <h3>Participants ({participantsList.length})</h3>
            <ul className="event-participants-list">
              {participantsList.length === 0 ? (
                <li>No participants</li>
              ) : (
                participantsList.map((participantId) => (
                  <li key={participantId}>{getUsername(participantId)}</li>
                ))
              )}
            </ul>
          </div>

          <div className="event-detail-section">
            <h3>Placements</h3>
            <div className="event-placements">
              <div className="placement">
                <span className="placement-label">🥇 1st Place:</span>
                <span className="placement-value">{getUsername(firstplace)}</span>
              </div>
              <div className="placement">
                <span className="placement-label">🥈 2nd Place:</span>
                <span className="placement-value">{getUsername(secondplace)}</span>
              </div>
              <div className="placement">
                <span className="placement-label">🥉 3rd Place:</span>
                <span className="placement-value">{getUsername(thirdplace)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
