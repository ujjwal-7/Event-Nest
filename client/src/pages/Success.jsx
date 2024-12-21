import { Flex, Center, Text } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const SuccessPage = () => {
  return (
    <>
      <Center mt="10%">
        <Flex w="500px" flexDirection="column" alignItems="center" py={10} textAlign="center">
          <MdCheckCircle size={150} color="#48BB78" />
          <Text fontSize={["2xl", "3xl"]} as="b" color="#48BB78">
            We’ve secured your tickets.
          </Text>
          <Text fontSize="lg" color="#94928e" as="b">A confirmation email with your booking details has been sent.</Text>
        </Flex>
      </Center>
    </>
  );
};

export default SuccessPage;
