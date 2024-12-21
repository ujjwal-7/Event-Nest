import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";

const EventList = ({ events }) => {

  return (
    <>
      {events?.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`}>
          <EventCard event={event} />
        </Link>
      ))}
    </>
  );
};

export default EventList;
