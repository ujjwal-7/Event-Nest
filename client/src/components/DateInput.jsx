import { Flex, Heading, Box, Text } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = ({ label, selectedDate, onChange, minDate, error }) => (
  <Flex
    gap="5"
    flexDirection={["column", "row"]}
    width={["100%", "55%", "35%"]}
    alignItems={["null", "center"]}
  >
    <Heading size="sm">{label}</Heading>
    <Box px="2">
      <DatePicker
        selected={selectedDate}
        minDate={minDate}
        onChange={onChange}
      />
    </Box>
    {error && <Text color="red.500">{error}</Text>}
  </Flex>
);

export default DateInput;
