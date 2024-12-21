import { Flex, Input, Box, SimpleGrid , Text} from "@chakra-ui/react";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import useFetchEvents from "../hooks/useFetchEvents";
import EventCardSkeleton from "../components/EventCardSkeleton";
import EventList from "../components/EventList";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);
  const navigate = useNavigate();

  const filters = useMemo(() => ({
    search,
  }), [search]);

  const { events, isLoading, error } = useFetchEvents(triggerSearch ? filters : null);

  const handleSearchQuery = (e) => {
    if (e.key === "Enter") {
      setSearchParams({ q: search });
      setTriggerSearch(true);
    }
  };

  useEffect(() => {
    const querySearch = searchParams.get("q") || "";
    if(querySearch === "") {
        navigate('/');
    }
    setSearch(querySearch);
    if (querySearch) {
      setTriggerSearch(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (triggerSearch) {
      setTriggerSearch(false); 
    }
  }, [events]);


  return (
    <>
      <Box>
        <Flex w={["100%", "100%", "100%"]} gap="4" alignItems="center">
          <Flex
            alignItems="center"
            gap="3"
            h={["39", "45", "50"]}
            w="100%"
            p={["2", "3"]}
            border="1px solid black"
            rounded="md"
          >
            <IoSearchSharp size="24" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleSearchQuery}
              name="search"
              fontSize={["15", "18"]}
              variant="unstyled"
              placeholder="Search for event, category or place"
            />
          </Flex>
        </Flex>

        {events.length > 0 ? <Text fontSize="lg" mt="5">{events.length} results for {`"${searchParams.get("q")}"`}</Text> : null}

        <SimpleGrid minChildWidth="250px" spacingX="4" spacingY="10" mt="7">
          {isLoading  || error ? (
            Array.from({ length: 16 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          ) : (
            <EventList events={events} />
          )}
        </SimpleGrid>
        
      </Box>
    </>
  );
};

export default SearchResults;
