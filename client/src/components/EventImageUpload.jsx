import { Box, Heading, Input, Text } from "@chakra-ui/react";

const EventImageUpload = ({ onChange, selectedFile, error }) => {
  return (
    <Box mt="7">
      <Heading mb="3" size="sm">
        Event image
      </Heading>
      <Input
        width={["100%", "60%", "40%"]}
        type="file"
        onChange={onChange}
        isInvalid={!!error}
      />
      {error && <Text color="red.500">{error}</Text>}
      {selectedFile && (
        <Text mt="2" color="gray.600">
          {selectedFile.name}
        </Text>
      )}
    </Box>
  );
};

export default EventImageUpload;
