"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/* ================= TYPES ================= */

type User = {
  userid: string;
  firstname: string | null;
  lastname: string | null;
  role: string | null;
  house: string | null;
};

type Event = {
  eventid: string;
  eventorder: number;
  eventname: string;
  participants: string[] | null;

  firstplaceuserids: string[] | null;
  secondplaceuserids: string[] | null;
  thirdplaceuserids: string[] | null;

  completed: boolean;
  created_at: string;
};

/* ================= COMPONENT ================= */

export default function EventAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  /* ================= LOAD ================= */

  async function loadData() {
    setLoading(true);

    const [{ data: usersData }, { data: eventsData }] = await Promise.all([
      supabase
        .from("users")
        .select("*")
        .neq("role", "admin")
        .order("firstname"),

      supabase
        .from("events")
        .select("*")
        .order("eventorder", { ascending: true }),
    ]);

    setUsers(usersData ?? []);
    setEvents(eventsData ?? []);
    setLoading(false);
  }

  /* ================= EVENT CRUD ================= */

  async function createEvent() {
    const highestOrder =
      events.length > 0
        ? Math.max(...events.map((e) => e.eventorder))
        : -1;

    await supabase.from("events").insert({
      eventname: "New Event",
      eventorder: highestOrder + 1,
      participants: [],
      firstplaceuserids: [],
      secondplaceuserids: [],
      thirdplaceuserids: [],
      completed: false,
    });

    loadData();
  }

  async function deleteEvent(eventid: string) {
    if (!confirm("Delete this event?")) return;

    await supabase.from("events").delete().eq("eventid", eventid);

    await updateUserStats();
    loadData();
  }

  async function updateEventName(eventid: string, eventname: string) {
    setEvents((curr) =>
      curr.map((e) => (e.eventid === eventid ? { ...e, eventname } : e))
    );

    await supabase.from("events").update({ eventname }).eq("eventid", eventid);
  }

  async function toggleCompleted(event: Event) {
    await supabase
      .from("events")
      .update({ completed: !event.completed })
      .eq("eventid", event.eventid);

    loadData();
  }

  /* ================= PARTICIPANTS ================= */

  async function toggleParticipant(event: Event, userid: string) {
    let participants = [...(event.participants ?? [])];

    if (participants.includes(userid)) {
      participants = participants.filter((id) => id !== userid);
    } else {
      participants.push(userid);
    }

    await supabase
      .from("events")
      .update({ participants })
      .eq("eventid", event.eventid);

    await updateUserStats();
    loadData();
  }

  async function toggleSelectAll(event: Event) {
    const all = users.map((u) => u.userid);

    const selectAll =
      (event.participants ?? []).length !== users.length;

    await supabase
      .from("events")
      .update({
        participants: selectAll ? all : [],
        firstplaceuserids: [],
        secondplaceuserids: [],
        thirdplaceuserids: [],
      })
      .eq("eventid", event.eventid);

    await updateUserStats();
    loadData();
  }

  /* ================= PODIUM ================= */

  function toggleArray(arr: string[] | null, userid: string) {
    const list = arr ? [...arr] : [];
    return list.includes(userid)
      ? list.filter((id) => id !== userid)
      : [...list, userid];
  }

  async function togglePodium(
  event: Event,
  position: "firstplaceuserids" | "secondplaceuserids" | "thirdplaceuserids",
  userid: string
) {
  const updated = {
    firstplaceuserids: [...(event.firstplaceuserids ?? [])],
    secondplaceuserids: [...(event.secondplaceuserids ?? [])],
    thirdplaceuserids: [...(event.thirdplaceuserids ?? [])],
  };

  // remove user from ALL positions first (ensures uniqueness)
  updated.firstplaceuserids = updated.firstplaceuserids.filter(id => id !== userid);
  updated.secondplaceuserids = updated.secondplaceuserids.filter(id => id !== userid);
  updated.thirdplaceuserids = updated.thirdplaceuserids.filter(id => id !== userid);

  // if user was already in clicked position → just remove (toggle off)
  const wasAlreadyInPosition = (event[position] ?? []).includes(userid);

  if (!wasAlreadyInPosition) {
    updated[position] = [...updated[position], userid];
  }

  await supabase
    .from("events")
    .update(updated)
    .eq("eventid", event.eventid);

  await updateUserStats();
  loadData();
}

  /* ================= USER STATS ================= */

  async function updateUserStats() {
    const { data: allEvents } = await supabase
      .from("events")
      .select(
        "participants, firstplaceuserids, secondplaceuserids, thirdplaceuserids"
      );

    const stats: Record<
      string,
      {
        participationcount: number;
        firstplacecount: number;
        secondplacecount: number;
        thirdplacecount: number;
      }
    > = {};

    users.forEach((u) => {
      stats[u.userid] = {
        participationcount: 0,
        firstplacecount: 0,
        secondplacecount: 0,
        thirdplacecount: 0,
      };
    });

    (allEvents ?? []).forEach((event) => {
  (event.participants ?? []).forEach((id: string) => {
    if (stats[id]) stats[id].participationcount++;
  });

  (event.firstplaceuserids ?? []).forEach((id: string) => {
    if (stats[id]) stats[id].firstplacecount++;
  });

  (event.secondplaceuserids ?? []).forEach((id: string) => {
    if (stats[id]) stats[id].secondplacecount++;
  });

  (event.thirdplaceuserids ?? []).forEach((id: string) => {
    if (stats[id]) stats[id].thirdplacecount++;
  });
});

    await Promise.all(
      Object.entries(stats).map(([userid, values]) =>
        supabase.from("users").update(values).eq("userid", userid)
      )
    );
  }

  /* ================= DRAG ================= */

  async function reorderEvents(sourceId: string, targetId: string) {
    const reordered = [...events];

    const from = reordered.findIndex((e) => e.eventid === sourceId);
    const to = reordered.findIndex((e) => e.eventid === targetId);

    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    setEvents(reordered);

    await Promise.all(
      reordered.map((e, i) =>
        supabase.from("events").update({ eventorder: i }).eq("eventid", e.eventid)
      )
    );

    loadData();
  }

  /* ================= UI ================= */

  function toggleExpanded(id: string) {
    setExpandedEvents((curr) =>
      curr.includes(id)
        ? curr.filter((x) => x !== id)
        : [...curr, id]
    );
  }

  if (loading) return <p>Loading events...</p>;

  const upcoming = events.filter((e) => !e.completed);
  const completed = events.filter((e) => e.completed);

  /* ================= RENDER ================= */

  function renderEvent(event: Event) {
    const expanded = expandedEvents.includes(event.eventid);

    return (
      <div
        key={event.eventid}
        className="event-admin-card"
        draggable
        onDragStart={() => setDraggingEventId(event.eventid)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() =>
          draggingEventId &&
          draggingEventId !== event.eventid &&
          reorderEvents(draggingEventId, event.eventid)
        }
      >
        <div className="event-admin-header">
          <span className="event-admin-drag">☰</span>

          <input
            className="event-admin-name"
            value={event.eventname}
            onChange={(e) =>
              updateEventName(event.eventid, e.target.value)
            }
          />

          <button
            className="event-admin-expand"
            onClick={() => toggleExpanded(event.eventid)}
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>

        {expanded && (
          <div className="event-admin-panel">
            <button
              className="event-admin-select-all"
              onClick={() => toggleSelectAll(event)}
            >
              Select All
            </button>

            <div className="event-admin-grid">
              {users.map((user) => {
                const selected =
                  (event.participants ?? []).includes(user.userid);

                return (
                  <button
                    key={user.userid}
                    className={`event-admin-player ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => toggleParticipant(event, user.userid)}
                  >
                    {user.firstname} {user.lastname}
                  </button>
                );
              })}
            </div>

            {(
              ["firstplaceuserids", "secondplaceuserids", "thirdplaceuserids"] as const
            ).map((pos) => (
              <div key={pos} className="event-admin-podium">
                <h4>{pos.replace("userids", "").toUpperCase()}</h4>

                <div className="event-admin-grid">
                  {users
                    .filter((u) =>
                      (event.participants ?? []).includes(u.userid)
                    )
                    .map((u) => {
                      const selected =
                        (event[pos] ?? []).includes(u.userid);

                      return (
                        <button
                          key={u.userid}
                          className={`event-admin-player ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() =>
                            togglePodium(event, pos, u.userid)
                          }
                        >
                          {u.firstname} {u.lastname}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}

            <div className="event-admin-actions">
              <label>
                <input
                  type="checkbox"
                  checked={event.completed}
                  onChange={() => toggleCompleted(event)}
                />
                Completed
              </label>

              <button
                className="event-admin-delete"
                onClick={() => deleteEvent(event.eventid)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="event-admin">
      <button className="event-admin-create" onClick={createEvent}>
        + Create Event
      </button>
      <h2>Upcoming Events</h2>
      <div className="event-admin-list">{upcoming.map(renderEvent)}</div>

    <br></br>
      <h2>Completed Events</h2>
      <div className="event-admin-list">{completed.map(renderEvent)}</div>
    </div>
  );
}