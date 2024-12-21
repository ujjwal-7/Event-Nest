import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";
import MobileNavbar from "./MobileNavbar";
import navbarItems from "../utils/navbarItems";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(AuthContext);

  return (
    <Box
      bg="white"
      w="100%"
      h="64px"
      position="fixed"
      top="0"
      zIndex="1000"
      boxShadow="md"
    >
      <Flex
        maxW="6xl"
        p="3"
        mx="auto"
        h="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Link to="/" aria-label="Go to Home page">
          <Flex alignItems="center" gap={3}>
            <Image
              
              src="/images/icons8-nest-50.png"
              alt="Logo"
              boxSize="50px"
              objectFit="contain"
            />
            <Text
              display={["none", "none", "block"]}
              fontSize="lg"
              as={"b"}
              color="rgb(246 88 88)"
            >
              EventNest
            </Text>
          </Flex>
        </Link>
        <Flex
          display={["none", "none", "none", "flex"]}
          justifyContent="space-between"
          w="35%"
        >
          {navbarItems.map((item) => {
            return (
              <Button
                key={item.id}
                as={NavLink}
                to={item.slug}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#e1e5e8" : "white",
                  color: "#00798a",
                })}
              >
                {item.name}
              </Button>
            );
          })}
        </Flex>

        {user ? (
          <Avatar
            as={NavLink}
            to={`users/${user.id}`}
            size="md"
            name={`${user.firstName} ${user.lastName}`}
            display={["none", "none", "none", "flex"]}
          />
        ) : (
          <Flex display={["none", "none", "none", "flex"]} gap={["2", "5"]}>
            <Button
              as={NavLink}
              to="signup"
              size={["sm", "sm", "md", "md"]}
              color="#00798a"
              bg="white"
            >
              Signup
            </Button>
            <Button
              as={NavLink}
              to="/login"
              size={["sm", "sm", "md", "md"]}
              color="white"
              bg="rgb(246 88 88)"
              _hover={{ bg: "rgb(240 67 67)" }}
            >
              Login
            </Button>
          </Flex>
        )}

        <IconButton
          display={["flex", "flex", "flex", "none"]}
          bg="white"
          onClick={onOpen}
          aria-label="menu"
          icon={<IoMenu size="25px" />}
        />

        <MobileNavbar
          navbarItems={navbarItems}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Flex>
    </Box>
  );
};

export default Navbar;
