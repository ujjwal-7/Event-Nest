import { Box, Button, Flex, Text } from "@chakra-ui/react";

const Pagination = ({ currentPage, totalPages, handlePrev, handleNext }) => {
  return (
    <Flex mt="10" justifyContent="center" textAlign="center" gap="4">
      <Button
        size="sm"
        bg="#00798a"
        color="white"
        variant="solid"
        _hover={{ bg: "#00798a", color: "white", variant: "solid" }}
        isDisabled={currentPage == 1}
        onClick={handlePrev}
      >
        Prev
      </Button>
      <Box>
        <Text fontSize="xl">
          {currentPage} / {totalPages}
        </Text>
      </Box>
      <Button
        size="sm"
        bg="#00798a"
        color="white"
        variant="solid"
        _hover={{ bg: "#00798a", color: "white", variant: "solid" }}
        isDisabled={currentPage == totalPages}
        onClick={handleNext}
      >
        Next
      </Button>
    </Flex>
  );
};

export default Pagination;
