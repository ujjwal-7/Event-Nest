import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { IoCalendarNumber, IoLocationSharp } from "react-icons/io5";
import formatDate from "../utils/formatDate";
import formatTime from "../utils/formatTime";
import parse from "html-react-parser";

const EventDetails = ({
  startDate,
  endDate,
  startTime,
  endTime,
  address,
  description,
}) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const formattedStartTime = formatTime(startTime);
  const formattedendTime = formatTime(endTime);

  return (
    <>
      <Flex w={["100%", "100%", "100%", "70%"]} flexDirection="column" gap="7">
        <Box>
          <Heading size="md">Date and time</Heading>
          <Flex alignItems="center" gap="4" mt="4">
            <IoCalendarNumber size="24" />
            <Text fontSize={["sm", "md"]}>
              {`${formattedStartDate}, ${formattedStartTime} - ${formattedEndDate}, ${formattedendTime}`}
            </Text>
          </Flex>
        </Box>
        <Box>
          <Heading size="md">Location</Heading>
          <Flex gap="4" mt="4">
            <IoLocationSharp size="24" />
            <Box>
              <Text fontSize={["sm", "md"]}>{address.street},</Text>
              <Text fontSize={["sm", "md"]}>
                {`${address.city}, ${address.state}, ${address.postalCode} ${address.country}`}
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box>
          <Heading size="md">About this event</Heading>
          <Box textAlign="justify" mt="3">
            {parse(description)}
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default EventDetails;
