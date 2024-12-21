import { Center, Heading, Image } from "@chakra-ui/react";

const NoResults = ({ message }) => {
  return (
    <Center flexDirection="column" w="100%" h="100%" gap="4">
      <Image src="/images/image copy 2.png" />
      <Heading size={["md", "lg"]}>{message}</Heading>
    </Center>
  );
};

export default NoResults;
