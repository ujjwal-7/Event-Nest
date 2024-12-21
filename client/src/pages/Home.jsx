import {
  Center,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import Filters from "../components/Filters";
import { useContext, useState } from "react";
import useFetchEvents from "../hooks/useFetchEvents";
import EventCardSkeleton from "../components/EventCardSkeleton";
import { AuthContext } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import EventList from "../components/EventList";
import NoResults from "../components/NoResults";

const Home = () => {
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    priceSort: "",
    dateSort: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const { events, totalPages, isLoading, error } = useFetchEvents(
    filters,
    currentPage
  );
  
  
  return (
    <>
      <Flex
        w="100%"
        flexDirection={["column-reverse", "column-reverse", "row"]}
        py="10"
      >
        <Flex flexDirection="column" gap="7" w={["100%", "100%", "60%"]}>
          <Heading size={["xl", "xl", "xl", "2xl"]}>
            The people platform—Where interests become friendships
          </Heading>
          <Text fontSize="lg" textAlign="justify">
            {user
              ? "Welcome aboard! 🚀 You've unlocked access to a vibrant community of like-minded individuals. Dive into a world of events tailored to your interests, make meaningful connections, and turn every moment into an adventure. The journey starts now—let's make it unforgettable!"
              : "Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on EventNest. Events are happening every day—sign up to join the fun."}
          </Text>
          {!user && (
            <Button
              w={["30%", "24%", "18%"]}
              variant="outline"
              border="2px solid #00798a"
              color="#00798a"
              _hover={{ bg: "#00798a", color: "white", variant: "solid" }}
            >
              Join now
            </Button>
          )}
        </Flex>
        <Center w={["100%", "100%", "40%"]}>
          <Image
            objectFit="contain"
            width="400px"
            height="275px"
            src="https://secure.meetupstatic.com/next/images/indexPage/irl_event.svg?w=828"
            alt="Banner"
          />
        </Center>
      </Flex>

      <Filters filters={filters} setFilters={setFilters} />

      <SimpleGrid
        h="100%"
        w="100%"
        columns={[1, 2, 3, 4]}
        spacingX="7"
        spacingY="7"
        mt="7"
      >
        {isLoading || error ? (
          Array.from({ length: 12 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))
        ) : (
          <EventList events={events} />
        )}
      </SimpleGrid>

      {events?.length == 0 && !isLoading ? <NoResults message="We couldn't find anything"/> : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      )}
    </>
  );
};

export default Home;
