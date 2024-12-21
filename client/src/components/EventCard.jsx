import {
  Box,
  Card,
  CardBody,
  Image,
  Flex,
  Heading,
  Text,
  useToast,
  Badge,
} from "@chakra-ui/react";
import {
  IoTicketOutline,
  IoWalk,
  IoBookmarkOutline,
  IoBookmark,
} from "react-icons/io5";
import formatDate from "../utils/formatDate";
import { getEventStatus } from "../utils/getEventStatus";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, onBookmarkUpdate }) => {
  const { user } = useContext(AuthContext);
  const status = getEventStatus(event.startDate, event.endDate);
  const navigate = useNavigate();
  const toast = useToast();

  const [isBookmarked, setIsBookmarked] = useState(event.isBookmarked);

  const addToBookmark = async (eventId) => {
    if (!user) {
      navigate("/login");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/${eventId}/bookmark`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          method: "POST",
        }
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.explaination);
      }

      if (onBookmarkUpdate) onBookmarkUpdate();

      setIsBookmarked(true);
      toast({
        title: result.message,
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      setIsBookmarked(true);
    }
  };

  const removeFromBookmark = async (eventId) => {
    if (!user) {
      navigate("/login");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/${eventId}/bookmark`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          method: "DELETE",
        }
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.explaination);
      }

      if (onBookmarkUpdate) onBookmarkUpdate();

      setIsBookmarked(false);
      toast({
        title: result.message,
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      setIsBookmarked(true);
    }
  };

  return (
    <Card
      w={["100%", "100%", "260px"]}
      shadow="none"
      _hover={{ cursor: "pointer" }}
    >
      <CardBody>
        <Box position="relative" h={[40]}>
          <Image
            src={`${event?.image}`}
            alt="Green double couch with wooden legs"
            borderRadius="lg"
            w="100%"
            h="100%"
            objectFit="cover"
          />
          <Badge position="absolute" top={0} right={0}>
            {status}
          </Badge>
        </Box>

        <Heading mt="3" size="md">
          {event?.title}
        </Heading>
        <Text as="b" fontSize="sm" color="#707070">
          Hosted By: {event.host.firstName} {event.host.lastName}
        </Text>
        <Flex w="100%" flexDirection="column" gap="2" my="2">
          <Text fontSize="md">{formatDate(event?.startDate)}</Text>
          <Flex w="100%" justifyContent="space-between">
            <Flex alignItems="center" gap="2">
              <IoWalk size={18} />
              <Text fontSize="md">
                {event.orderCount} {status === "Expired" ? "attended" : "going"}
              </Text>
            </Flex>

            {event.price === 0 ? (
              <Badge p="1" variant="subtle" colorScheme="green">
                Free
              </Badge>
            ) : (
              <Flex alignItems="center" gap="2">
                <IoTicketOutline size={18} />
                <Text fontSize="md">${event.price}</Text>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex
          justifyContent={
            user && user.id == event.hostId ? "space-between" : "flex-end"
          }
          alignItems="center"
        >
          {user && user.id == event.hostId ? (
            <Text
              cursor="pointer"
              textDecoration="underline"
              _hover={{ fontWeight: "bold" }}
              size="sm"
              onClick={() => {
                navigate(`/events/${event.id}/orders`);
              }}
            >
              Order details
            </Text>
          ) : null}

          {isBookmarked ? (
            <IoBookmark
              size={18}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromBookmark(event.id);
              }}
            />
          ) : (
            <IoBookmarkOutline
              size={18}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToBookmark(event.id);
              }}
            />
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default EventCard;
