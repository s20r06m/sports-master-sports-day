"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  firstplace: string | null;
  secondplace: string | null;
  thirdplace: string | null;
  completed: boolean;
  created_at: string;
};

export default function EventAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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

  async function createEvent() {
    const highestOrder =
      events.length > 0
        ? Math.max(...events.map((e) => e.eventorder))
        : -1;

    const { error } = await supabase.from("events").insert({
      eventname: "New Event",
      eventorder: highestOrder + 1,
      participants: [],
      completed: false,
    });

    if (!error) {
      loadData();
    }
  }

  async function deleteEvent(eventid: string) {
    if (!confirm("Delete this event?")) return;

    await supabase
      .from("events")
      .delete()
      .eq("eventid", eventid);
await updateUserStats();
    loadData();
  }

  async function updateEventName(
    eventid: string,
    eventname: string
  ) {
    setEvents((current) =>
      current.map((event) =>
        event.eventid === eventid
          ? { ...event, eventname }
          : event
      )
    );

    await supabase
      .from("events")
      .update({ eventname })
      .eq("eventid", eventid);
  }

  async function toggleCompleted(event: Event) {
    await supabase
      .from("events")
      .update({
        completed: !event.completed,
      })
      .eq("eventid", event.eventid);

    loadData();
  }
  async function updateUserStats() {
    const { data: events } = await supabase
      .from("events")
      .select(
        "participants, firstplace, secondplace, thirdplace"
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

    users.forEach((user) => {
      stats[user.userid] = {
        participationcount: 0,
        firstplacecount: 0,
        secondplacecount: 0,
        thirdplacecount: 0,
      };
    });

    (events ?? []).forEach((event) => {
      (event.participants ?? []).forEach((userid: string) => {
        if (stats[userid]) {
          stats[userid].participationcount += 1;
        }
      });

      if (event.firstplace && stats[event.firstplace]) {
        stats[event.firstplace].firstplacecount += 1;
      }

      if (event.secondplace && stats[event.secondplace]) {
        stats[event.secondplace].secondplacecount += 1;
      }

      if (event.thirdplace && stats[event.thirdplace]) {
        stats[event.thirdplace].thirdplacecount += 1;
      }
    });

    await Promise.all(
      Object.entries(stats).map(([userid, values]) =>
        supabase
          .from("users")
          .update(values)
          .eq("userid", userid)
      )
    );
  }
  async function toggleParticipant(
    event: Event,
    userid: string
  ) {
    let participants = [...(event.participants ?? [])];

    if (participants.includes(userid)) {
      participants = participants.filter(
        (id) => id !== userid
      );
    } else {
      participants.push(userid);
    }

    let firstplace = event.firstplace;
    let secondplace = event.secondplace;
    let thirdplace = event.thirdplace;

    if (!participants.includes(firstplace ?? "")) {
      firstplace = null;
    }

    if (!participants.includes(secondplace ?? "")) {
      secondplace = null;
    }

    if (!participants.includes(thirdplace ?? "")) {
      thirdplace = null;
    }

    await supabase
      .from("events")
      .update({
        participants,
        firstplace,
        secondplace,
        thirdplace,
      })
      .eq("eventid", event.eventid);

    await updateUserStats();
    loadData();
  }

  async function toggleSelectAll(event: Event) {
    const allUserIds = users.map((u) => u.userid);

    const selectAll =
      (event.participants ?? []).length !== users.length;

    await supabase
      .from("events")
      .update({
        participants: selectAll ? allUserIds : [],
        firstplace: null,
        secondplace: null,
        thirdplace: null,
      })
      .eq("eventid", event.eventid);

    loadData();
  }

  async function setPodium(
    event: Event,
    position: "firstplace" | "secondplace" | "thirdplace",
    userid: string
  ) {
    const updateData = {
      firstplace: event.firstplace,
      secondplace: event.secondplace,
      thirdplace: event.thirdplace,
    };

    Object.keys(updateData).forEach((key) => {
      const typedKey =
        key as keyof typeof updateData;

      if (updateData[typedKey] === userid) {
        updateData[typedKey] = null;
      }
    });

    updateData[position] = userid;

    await supabase
      .from("events")
      .update(updateData)
      .eq("eventid", event.eventid);
await updateUserStats();
    loadData();
  }

  async function reorderEvents(
    sourceId: string,
    targetId: string
  ) {
    const reordered = [...events];

    const sourceIndex = reordered.findIndex(
      (e) => e.eventid === sourceId
    );

    const targetIndex = reordered.findIndex(
      (e) => e.eventid === targetId
    );

    const [moved] = reordered.splice(sourceIndex, 1);

    reordered.splice(targetIndex, 0, moved);

    setEvents(reordered);

    await Promise.all(
      reordered.map((event, index) =>
        supabase
          .from("events")
          .update({
            eventorder: index,
          })
          .eq("eventid", event.eventid)
      )
    );

    loadData();
  }

  function userName(userid: string | null) {
    const user = users.find(
      (u) => u.userid === userid
    );

    if (!user) return "Select";

    return `${user.firstname ?? ""} ${user.lastname ?? ""
      }`;
  }

  function toggleExpanded(eventid: string) {
    setExpandedEvents((current) =>
      current.includes(eventid)
        ? current.filter((id) => id !== eventid)
        : [...current, eventid]
    );
  }

  if (loading) {
    return <p>Loading events...</p>;
  }

  const upcomingEvents = events.filter(
    (event) => !event.completed
  );

  const completedEvents = events.filter(
    (event) => event.completed
  );

  return (
    <div className="event-admin">

      <button
        className="event-admin-create"
        onClick={createEvent}
      >
        + Create Event
      </button>

      <h2>Upcoming Events</h2>

      <div className="event-admin-list">
        {upcomingEvents.map((event) =>
          renderEvent(event)
        )}
      </div>
        <br></br>
      <h2>Completed Events</h2>

      <div className="event-admin-list">
        {completedEvents.map((event) =>
          renderEvent(event)
        )}
      </div>
    </div>
  );

  function renderEvent(event: Event) {
    const isExpanded =
      expandedEvents.includes(event.eventid);

    const podiumSelections = [
      event.firstplace,
      event.secondplace,
      event.thirdplace,
    ];

    return (
      <div
        key={event.eventid}
        className="event-admin-card"
        draggable
        onDragStart={() =>
          setDraggingEventId(event.eventid)
        }
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (
            draggingEventId &&
            draggingEventId !== event.eventid
          ) {
            reorderEvents(
              draggingEventId,
              event.eventid
            );
          }
        }}
      >
        <div className="event-admin-header">
          <span className="event-admin-drag">
            ☰
          </span>

          <input
            className="event-admin-name"
            value={event.eventname}
            onChange={(e) =>
              updateEventName(
                event.eventid,
                e.target.value
              )
            }
          />

          <button
            className="event-admin-expand"
            onClick={() =>
              toggleExpanded(event.eventid)
            }
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>

        {isExpanded && (
          <div className="event-admin-panel">

            <button
              className="event-admin-select-all"
              onClick={() =>
                toggleSelectAll(event)
              }
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
                    className={`event-admin-player ${selected ? "selected" : ""
                      }`}
                    onClick={() =>

                      toggleParticipant(
                        event,
                        user.userid
                      )
                    }
                  >
                    {user.firstname}{" "}
                    {user.lastname}
                  </button>
                );
              })}
            </div>

            <div className="event-admin-podium">

              {(
                [
                  "firstplace",
                  "secondplace",
                  "thirdplace",
                ] as const
              ).map((position) => (
                <select
                  key={position}
                  value={
                    event[position] ?? ""
                  }
                  onChange={(e) =>
                    setPodium(
                      event,
                      position,
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    {position}
                  </option>

                  {users
                    .filter((user) =>
                      (event.participants ?? []).includes(user.userid)
                    )
                    .filter(
                      (user) =>
                        !podiumSelections.includes(
                          user.userid
                        ) ||
                        event[position] ===
                        user.userid
                    )
                    .map((user) => (
                      <option
                        key={user.userid}
                        value={user.userid}
                      >
                        {user.firstname}{" "}
                        {user.lastname}
                      </option>
                    ))}
                </select>
              ))}
            </div>

            <div className="event-admin-actions">

              <label>
                <input
                  type="checkbox"
                  checked={event.completed}
                  onChange={() =>
                    toggleCompleted(event)
                  }
                />
                Completed
              </label>

              <button
                className="event-admin-delete"
                onClick={() =>
                  deleteEvent(event.eventid)
                }
              >
                Delete
              </button>
            </div>

          </div>
        )}
      </div>
    );
  }
}