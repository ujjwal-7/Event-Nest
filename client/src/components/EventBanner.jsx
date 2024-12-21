import { Box, Image } from "@chakra-ui/react";

const EventBanner = ({ imageUrl }) => {
  return (
    <>
      <Box
        marginY="5"
        w="100%"
        rounded="xl"
        h={[200, 300, 350, 400, 450]}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bgImage={`url(${imageUrl})`}
          bgSize="cover"
          filter="blur(10px)"
          zIndex="-1"
          pointerEvents="none"
        />
        <Image
          src={imageUrl}
          objectFit={["contain"]}
          w="100%"
          h="100%"
          alt="Beautiful flowers"
          position="relative"
          zIndex="1"
        />
      </Box>
    </>
  );
};

export default EventBanner;
