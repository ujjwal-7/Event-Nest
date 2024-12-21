import { Skeleton, SkeletonText, Card, CardBody } from "@chakra-ui/react";

const EventCardSkeleton = () => {
  return (
    <Card
      minW="250px"
      maxW="sm"
      h="300px"
      boxShadow="md"
      _hover={{ boxShadow: "lg", cursor: "pointer" }}
    >
      <CardBody>
        <Skeleton h="60%" />
        <SkeletonText mt="5" noOfLines={3} spacing="4" skeletonHeight="2" />
      </CardBody>
    </Card>
  );
};

export default EventCardSkeleton;
