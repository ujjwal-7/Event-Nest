import { Flex, Box, Text } from "@chakra-ui/react";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTiktok,
  IoLogoTwitter,
  IoLogoYoutube,
} from "react-icons/io5";

const Footer = () => {
  return (
    <Box bg="rgb(33 33 33)" w="100%">
      <Box maxW="6xl" mx="auto" py="5" px="4">
        <Flex
          flexDirection={["column", "row"]}
          w="100%"
          gap="5"
          justifyContent={["null", "space-between"]}
          alignItems={["space-between", "null"]}
        >
          <Box color="#C5C4C4">
            <Text as="b" color="white">
              Your account
            </Text>
            <Text>Sign up</Text>
            <Text>Log in</Text>
            <Text>Help</Text>
            <Text>Become an Affiliate</Text>
          </Box>
          <Box color="#C5C4C4">
            <Text as="b" color="white">
              Discover
            </Text>
            <Text>Groups</Text>
            <Text>Calendar</Text>
            <Text>Topics</Text>
            <Text>Cities</Text>
            <Text>Online Events</Text>
            <Text>Local Guides</Text>
            <Text>Make Friends</Text>
          </Box>
          <Box color="#C5C4C4">
            <Text as="b" color="white">
              EventNest
            </Text>
            <Text>About</Text>
            <Text>Blog</Text>
            <Text>Careers</Text>
            <Text>Apps</Text>
            <Text>Podcast</Text>
          </Box>
        </Flex>

        <Box mt="7">
          <Text as="b" color="white">
            Follow us
          </Text>
          <Flex color="#C5C4C4" gap="4" mt="3">
            <IoLogoFacebook size={24} />
            <IoLogoInstagram size={24} />
            <IoLogoTwitter size={24} />
            <IoLogoYoutube size={24} />
            <IoLogoTiktok size={24} />
          </Flex>
        </Box>

        <Flex mt="7" color="#C5C4C4" flexDirection={["column", "row"]} gap="4">
          <Text>Terms of service</Text>
          <Text>Service policy</Text>
          <Text>Cookie policy</Text>
          <Text>Help</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer;
