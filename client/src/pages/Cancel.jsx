import { Flex, Center, Text } from "@chakra-ui/react";
import { MdCancel } from "react-icons/md";

const Cancel = () => {
  return (
    <>
      <Center mt="10%">
        <Flex w="500px" flexDirection="column" alignItems="center" py={10} textAlign="center">
          <MdCancel size={150} color="#F56565" />
          <Text fontSize={["2xl", "3xl"]} as="b" color="#F56565">
            We’re sorry, but there was an issue processing your booking.
          </Text>
          <Text fontSize="lg" as="b" color="#94928e">Please try again.</Text>
        </Flex>
      </Center>
    </>
  );
};

export default Cancel;

