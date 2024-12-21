import {
  Box,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Center,
  Avatar,
  useDisclosure,
  IconButton,
  SkeletonCircle,
  Skeleton,
} from "@chakra-ui/react";
import UserEvents from "../components/UserEvents";
import UserOrders from "../components/UserOrders";
import { useNavigate, useParams } from "react-router-dom";
import { MdModeEdit, MdLogout } from "react-icons/md";
import EditProfileDetailsModal from "../components/EditProfileDetailsModal";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import useFetchProfiletDetails from "../hooks/useFetchProfileDetails";

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, handleLogout } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const { error } = useFetchProfiletDetails(userId);

  useEffect(() => {
    if (error && error === "Cannot access someone else profile.") {
      navigate("/");
    }
  }, [error, navigate]);

  return (
    <>
      <EditProfileDetailsModal
        userId={userId}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      <Center flexDirection="column" gap="5">
        {error ? (
          <SkeletonCircle />
        ) : (
          <Avatar size="xl" name={`${user?.firstName} ${user.lastName}`} />
        )}
        {error ? (
          <>
            <Skeleton height="10px" />
            <Skeleton height="10px" />
            <Skeleton height="10px" />
          </>
        ) : (
          <>
            <Flex flexDirection="column" gap="3" alignItems="center">
              <Text fontSize="lg" as="b">
                <span>{user?.firstName}</span> <span>{user?.lastName}</span>
              </Text>
              <Text fontSize="lg" as="b">
                Email: {user?.email}
              </Text>
            </Flex>
            <Flex gap={7}>
              <IconButton onClick={onOpen} icon={<MdModeEdit size={20} />} />
              <IconButton onClick={() => {handleLogout();}} icon={<MdLogout size={20} />} />
            </Flex>
          </>
        )}
      </Center>

      <Box mt="10" py="4">
        <Tabs isFitted isLazy variant="soft-rounded" lazyBehavior="unmount">
          <TabList>
            <Tab>My events</Tab>
            <Tab>My orders</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UserEvents userId={userId} />
            </TabPanel>
            <TabPanel>
              <UserOrders userId={userId} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default ProfilePage;
