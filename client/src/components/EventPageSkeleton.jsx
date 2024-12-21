import { Box, Flex, Skeleton, SkeletonText, Heading } from "@chakra-ui/react";
import EventCardSkeleton from "./EventCardSkeleton";

const EventPageSkeleton = () => {
  return (
    <>
      <Box mb="6">
        <Skeleton height="40px" width="100%" mb="4" />
        <Skeleton height="20px" width="100%" />
      </Box>

      <Skeleton
        height={["200px", "300px", "350px"]}
        width="100%"
        marginY="5"
        borderRadius="md"
      />

      <Flex
        w="100%"
        gap="4"
        flexDirection={["column", "column", "column", "row"]}
      >
        <Flex
          w={["100%", "100%", "100%", "70%"]}
          flexDirection="column"
          gap="7"
        >
          <SkeletonText noOfLines={12} spacing="4" />
        </Flex>

        <Flex
          h={["auto", "auto", "auto", "30%"]}
          w={["auto", "auto", "auto", "30%"]}
          p="4"
          bg="white"
          boxShadow="md"
          flexDirection="column"
          alignItems="center"
          gap="5"
          mt={["10", "10", "10", "0"]}
          rounded="md"
        >
          <Skeleton height="10px" width="75%" />
          <Skeleton height="10px" width="75%" />
        </Flex>
      </Flex>

      <Box mt="10">
        <Heading size="lg" mb="4">
          Related Events
        </Heading>

        <Flex flexDirection={["column", "row"]} overflowX="auto" gap="5" py="3">
          {Array.from({ length: 4 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </Flex>
      </Box>
    </>
  );
};

export default EventPageSkeleton;
