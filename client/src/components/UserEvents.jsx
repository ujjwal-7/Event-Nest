import { SimpleGrid } from "@chakra-ui/react";
import EventCardSkeleton from "./EventCardSkeleton";
import useFetchUserEvents from "../hooks/useFetchUserEvents";
import EventList from "./EventList";
import Pagination from "./Pagination";
import { useState } from "react";
import NoResults from "./NoResults";

const UserEvents = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { events, totalPages, isLoading, error } = useFetchUserEvents(
    userId,
    currentPage
  );

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <SimpleGrid columns={[1, 2, 3, 4]} spacingX="7" spacingY="7" mt="7">
        {isLoading || error ? (
          Array.from({ length: 8 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))
        ) : events.length > 0 ? (
          <EventList events={events} />
        ) : <NoResults message="We couldn't find anything" />}
      </SimpleGrid>
      {events.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      ) : null}
    </>
  );
};

export default UserEvents;
