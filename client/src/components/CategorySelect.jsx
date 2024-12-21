import { Flex, Heading, Box, Select, Text } from "@chakra-ui/react";

const CategorySelect = ({ categories, value, onChange, error }) => (
  <Flex
    gap="5"
    flexDirection={["column", "row"]}
    width={["100%", "60%", "35%"]}
    alignItems={["null", "center"]}
  >
    <Heading size="sm">Categories</Heading>
    <Box px="2">
      <Select
        placeholder="Select category"
        variant="outline"
        value={value}
        onChange={onChange}
        isInvalid={!!error}
      >
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      {error && <Text color="red.500">{error}</Text>}
    </Box>
  </Flex>
);

export default CategorySelect;
