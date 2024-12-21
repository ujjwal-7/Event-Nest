import {
    Flex,
    Image,
  } from "@chakra-ui/react";

const Fallback = () => {
  return (
    <Flex h="100vh" alignItems="center" justifyContent="center">
        <Image 
            h={["10%"]}
            src="/images/icons8-nest-50.png" />
    </Flex>
  )
}

export default Fallback;