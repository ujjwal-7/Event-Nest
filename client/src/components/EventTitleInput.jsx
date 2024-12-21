import { Flex, Heading, Input, Text } from "@chakra-ui/react";

const EventTitleInput = ({ value, onChange, error }) => (
  <Flex flexDirection="column" gap="3">
    <Heading size="sm">Event Title</Heading>
    <Input
      placeholder="Event title"
      size="md"
      value={value}
      onChange={onChange}
      isInvalid={!!error}
    />
    {error && <Text color="red.500">{error}</Text>}
  </Flex>
);

export default EventTitleInput;
