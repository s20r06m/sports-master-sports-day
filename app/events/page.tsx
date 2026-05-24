import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import EventCard from "@/components/EventCard";

type Event = {
  eventid: string;
  eventorder: number;
  eventname: string;
  created_at: string;
  participants: string[];
  firstplace: string | null;
  secondplace: string | null;
  thirdplace: string | null;
  completed: boolean;
};

type User = {
  userid: string;
  firstname: string | null;
  lastname: string | null;
};

export default async function EventsPage() {
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select(
      "eventid, eventorder, eventname, created_at, participants, firstplace, secondplace, thirdplace, completed"
    )
    .order("eventorder", { ascending: true });

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("userid, firstname, lastname");

  console.log("Events query result - Data:", eventData, "Error:", eventError);
  console.log("Users query result - Data:", userData, "Error:", userError);

  if (eventError) {
    return (
      <main>
        <h1>Upcoming Events</h1>
        <p>Unable to load events. Error: {eventError.message}</p>
      </main>
    );
  }

  const events = (eventData ?? []) as Event[];
  const users = (userData ?? []) as User[];
  const upcomingEvents = events.filter((event) => !event.completed);
  const completedEvents = events.filter((event) => event.completed);

  return (
    <ProtectedRoute>
      <main>
        <h1>Upcoming Events</h1>
        {upcomingEvents.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <ul className="events-list">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.eventid}
                eventid={event.eventid}
                eventname={event.eventname}
                participants={event.participants}
                firstplace={event.firstplace}
                secondplace={event.secondplace}
                thirdplace={event.thirdplace}
                users={users}
              />
            ))}
          </ul>
        )}
      
        <h1><br></br>Completed Events</h1>
        {completedEvents.length === 0 ? (
          <p>No completed events.</p>
        ) : (
          <ul className="events-list">
            {completedEvents.map((event) => (
              <EventCard
                key={event.eventid}
                eventid={event.eventid}
                eventname={event.eventname}
                participants={event.participants}
                firstplace={event.firstplace}
                secondplace={event.secondplace}
                thirdplace={event.thirdplace}
                users={users}
              />
            ))}
          </ul>
        )}
      </main>
    </ProtectedRoute>
  );
}