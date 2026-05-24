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

  firstplaceuserids: string[];
  secondplaceuserids: string[];
  thirdplaceuserids: string[];

  users: User[];
};

export default function EventCard({
  eventid,
  eventname,
  participants,
  firstplaceuserids,
  secondplaceuserids,
  thirdplaceuserids,
  users,
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const userMap = new Map(users.map((user) => [user.userid, user]));

  const participantsList = participants ?? [];

  const getUsername = (userid: string) => {
    const user = userMap.get(userid);
    if (!user) return "Unknown";
    return `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();
  };

  const renderUserList = (ids: string[]) => {
    if (!ids || ids.length === 0) {
      return <div className="event-participant-empty">None</div>;
    }

    return ids.map((id) => (
      <div key={id} className="event-participant-pill">
        {getUsername(id)}
      </div>
    ));
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
          {/* PARTICIPANTS */}
          <div className="event-detail-section">
            <h3>Participants ({participantsList.length})</h3>

            <div className="event-participants-grid">
              {participantsList.length === 0 ? (
                <div className="event-participant-empty">
                  No participants
                </div>
              ) : (
                participantsList.map((id) => (
                  <div key={id} className="event-participant-pill">
                    {getUsername(id)}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PODIUM */}
          <div className="event-detail-section">
            <h3>Placements</h3>

            <div className="event-placements">
              <div className="placement">
                <span className="placement-label">🥇 1st Place:</span>
                <div className="event-participants-grid">
                  {renderUserList(firstplaceuserids ?? [])}
                </div>
              </div>

              <div className="placement">
                <span className="placement-label">🥈 2nd Place:</span>
                <div className="event-participants-grid">
                  {renderUserList(secondplaceuserids ?? [])}
                </div>
              </div>

              <div className="placement">
                <span className="placement-label">🥉 3rd Place:</span>
                <div className="event-participants-grid">
                  {renderUserList(thirdplaceuserids ?? [])}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}