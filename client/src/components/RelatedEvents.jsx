import { Flex } from "@chakra-ui/react";
import EventCard from "./EventCard";

const RelatedEvents = ({ events }) => {
  return (
    <>
      <Flex flexDirection={["column", "row"]} overflowX="auto" gap="5" py="3">
        {events.map((event, index) => {
          return <EventCard key={index} event={event} />;
        })}
      </Flex>
    </>
  );
};

export default RelatedEvents;
