import { Heading, SimpleGrid } from "@chakra-ui/react";
import EventCardSkeleton from "../components/EventCardSkeleton";
import useFetchBookmarks from "../hooks/useFetchBookmarks";
import EventCard from "../components/EventCard";
import NoResults from "../components/NoResults";

const BookmarkPage = () => {

  const {events, isLoading, refetch } = useFetchBookmarks();

  const handleBookmarkUpdate = () => {
    refetch(); 
  };


  return (
    <>
      <Heading>Bookmarked events</Heading>
      {
        events.length == 0 ? <NoResults message="We couldn't find anything" /> : null
      }
      <SimpleGrid
        h="100%"
        w="100%"
        columns={[1, 2, 3, 4]}
        spacingX="4"
        spacingY="7"
        mt="7"
      >
        {isLoading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))
        ) : ( events?.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onBookmarkUpdate={handleBookmarkUpdate}
          />
        )))}
      </SimpleGrid>

    </>
  )
}

export default BookmarkPage;