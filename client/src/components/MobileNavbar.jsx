import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const MobileNavbar = ({ navbarItems, onClose, isOpen }) => {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" color="rgb(246 88 88)">
            <Flex alignItems="center" gap={3}>
              <Image
                h={[10, 10, 10, 12]}
                w={[10, 10, 10, 12]}
                src="/images/icons8-nest-50.png"
              />
              <Text fontSize="lg" as={"b"} color="rgb(246 88 88)">
                EventNest
              </Text>
            </Flex>
          </DrawerHeader>
          {navbarItems.map((item) => {
            return (
              <Text
                key={item.id}
                p="3"
                my="1"
                as={NavLink}
                onClick={() => {
                  onClose();
                }}
                to={item.slug}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#e1e5e8" : "white",
                  color: "#00798a",
                })}
              >
                {item.name}
              </Text>
            );
          })}

          {user ? (
            <Flex flexDirection="column">
              <Text
                as={NavLink}
                to={`users/${user.id}`}
                onClick={() => {
                  onClose();
                }}
                color="#00798a"
                p="3"
                _hover={{ bg: "#e1e5e8", cursor: "pointer" }}
              >
                Profile
              </Text>
              <Text
                color="#00798a"
                p="3"
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                _hover={{ bg: "#e1e5e8", cursor: "pointer" }}
              >
                Logout
              </Text>
            </Flex>
          ) : (
            <Flex flexDirection="column">
              <Text
                as={NavLink}
                onClick={() => {
                  onClose();
                }}
                color="#00798a"
                to="/login"
                p="3"
                _hover={{ bg: "#e1e5e8", cursor: "pointer" }}
              >
                Login
              </Text>
              <Text
                as={NavLink}
                onClick={() => {
                  onClose();
                }}
                color="#00798a"
                to="/signup"
                p="3"
                _hover={{ bg: "#e1e5e8", cursor: "pointer" }}
              >
                Signup
              </Text>
            </Flex>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
