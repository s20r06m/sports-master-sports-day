type SuggestedEvent = {
  eventid: string;
  eventname: string;
};

export default function SuggestedEventItem({
  eventname,
}: SuggestedEvent) {
  return (
    <li className="suggested-event-item">
      <span className="suggested-event-name">{eventname}</span>
    </li>
  );
}