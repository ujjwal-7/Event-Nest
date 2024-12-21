import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

function TimeInput({ label, value, onChange, error }) {
  return (
    <Flex
      gap="5"
      flexDirection={["column", "row"]}
      width={["100%", "55%", "35%"]}
      alignItems={["null", "center"]}
    >
      <Heading size="sm">{label}</Heading>
      <Box px="2">
        <TimePicker
          value={value}
          onChange={onChange}
          clearIcon={null}
          clockIcon={null}
        />
      </Box>
      {error && <Text color="red.500">{error}</Text>}
    </Flex>
  );
}

export default TimeInput;
