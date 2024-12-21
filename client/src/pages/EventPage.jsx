import {
  Box,
  Flex,
  Heading,
  Text,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  Button,
} from "@chakra-ui/react";
import EventBanner from "../components/EventBanner";
import EventHeader from "../components/EventHeader";
import EventDetails from "../components/EventDetails";
import EventCard from "../components/EventCard";
import { useContext, useState } from "react";
import { OrderContext } from "../context/OrderContext";
import { useNavigate, useParams } from "react-router-dom";
import EventPageSkeleton from "../components/EventPageSkeleton";
import useFetchEventDetails from "../hooks/useFetchEventDetails";
import { Link } from "react-router-dom";
import useFetchRelatedEvents from "../hooks/useFetchRelatedEvents";
import { getEventStatus } from "../utils/getEventStatus";
import formatDate from "../utils/formatDate";
import formatTime from "../utils/formatTime";
import NoResults from "../components/NoResults";

const EventPage = () => {

  const [quantity, setQuantity] = useState(1);
  const { updateOrderDetails } = useContext(OrderContext);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { event, isLoading, error } = useFetchEventDetails(eventId);
  const { relatedEvents } = useFetchRelatedEvents(eventId);
  const status = getEventStatus(event?.startDate, event?.endDate);

  const handleClick = () => {
    updateOrderDetails({
      eventId,
      eventTitle: event?.title,
      eventAddress: event?.address,
      eventDate: formatDate(event?.startDate),
      eventStartTime: formatTime(event?.startTime),
      price: event?.price,
      quantity,
    });
    navigate("/order");
  };

  if(error == "Event does not exist.") {
    return <NoResults message="We couldn't find anything"/>
  }

  if (isLoading || error) {
    return <EventPageSkeleton />;
  }

  return (
    <>
      <EventHeader
        title={event?.title}
        host={event?.host}
        tagLabel={event?.category?.name}
        eventId={eventId}
        status={status}
      />
      <EventBanner imageUrl={event?.image} />

      <Flex
        w="100%"
        gap="4"
        flexDirection={["column", "column", "column", "row"]}
      >
        <EventDetails
          startDate={event?.startDate}
          endDate={event?.endDate}
          startTime={event?.startTime}
          endTime={event?.endTime}
          address={event?.address}
          description={event?.description}
        />
        <Flex
          h={["auto", "auto", "auto", "30%"]}
          w={["auto", "auto", "auto", "30%"]}
          p="4"
          position="sticky"
          bg="white"
          top={["auto", "auto", "auto", "24"]}
          bottom={["0", "0", "0", "auto"]}
          boxShadow="md"
          zIndex="100"
          flexDirection="column"
          alignItems="center"
          gap="5"
          border={["none", "none", "none", "none"]}
          rounded="md"
        >
          <Flex marginInline="auto" alignItems="center" gap="10">
            <Text fontSize={["xl", "2xl"]} as="b">
              ${event.price}
            </Text>
            <NumberInput
              defaultValue={1}
              min={1}
              max={event.seats}
              isDisabled={event?.seats === 0 || status === "Expired"}
              size="md"
              maxW="40"
              onChange={(value) => {
                setQuantity(value);
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>

          <Button
            isDisabled={event?.seats === 0 || status === "Expired" || status === "Ongoing"}
            bg="rgb(246 88 88)"
            color="white"
            _hover={{ bg: "rgb(240 67 67)" }}
            onClick={handleClick}
          >
            Get Tickets
          </Button>
          <Text color="red">
            {
              status === "Expired" ? "This event has expired!" : event?.seats === 0 ? "All tickets are sold!" : status === "Ongoing" ? "Ongoing event" : null
            }
           
          </Text>
        </Flex>
      </Flex>

      { relatedEvents?.length > 0 ? (
        <Box mt="10">
          <Heading size="lg" mb="4">
            Related Events
          </Heading>

          <Flex
            flexDirection={["column", "row"]}
            overflowX="auto"
            gap="5"
            py="3"
          >
            {relatedEvents?.map((event, index) => {
              return (
                <Link key={index} to={`/events/${event.id}`}>
                  <EventCard event={event} />
                </Link>
              );
            })}
          </Flex>
        </Box>
      ) : null}
    </>
  );
};

export default EventPage;
