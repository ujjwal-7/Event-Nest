import {
  Avatar,
  Flex,
  Heading,
  Text,
  Tag,
  TagLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const EventHeader = ({ title, host, tagLabel, eventId, status }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/${eventId}/delete`,
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

      toast({
        title: "Event deleted successfully",
        status: "success",
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: error.messsage,
        status: "cancel",
        isClosable: true,
      });
    }
  };

  const handleBookmark = async () => {
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

      toast({
        title: "Event bookmarked successfully",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log("error -> ", error.messsage);
    }
  };

  return (
    <Flex flexDirection="column" gap="3" position="relative">
      <Heading size={["xl", "2xl", "2xl"]}>{title}</Heading>
      <Flex
        justifyContent="space-between"
        borderY="2px solid rgb(46 62 72 / 12%)"
        py="2"
      >
        <Flex gap={3}>
          <Flex alignItems="center" gap={2}>
            <Avatar size="sm" name={`${host.firstName} ${host.lastName}`} />
            <Text fontSize={["sm", "md"]} as="b">
              {`${host.firstName} ${host.lastName}`}
            </Text>
          </Flex>
          <Tag mt={1} h={7} colorScheme="blue" size={["sm", "md"]}>
            <TagLabel size={["xs", "sm", "md"]} color="black" as="b">
              {tagLabel}
            </TagLabel>
          </Tag>
        </Flex>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<IoEllipsisVertical />}
            bg="white"
          >
            Profile
          </MenuButton>
          <MenuList position="relative" zIndex="10">
            <MenuItem onClick={handleBookmark}>Bookmark</MenuItem>
            {user && user?.id === host?.id && status != "Expired" ? (
              <Link to={`/events/update/${eventId}`}>
                <MenuItem>Edit</MenuItem>
              </Link>
            ) : null}
            {user && user?.id === host?.id && status != "Expired" ? (
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            ) : null}
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default EventHeader;
