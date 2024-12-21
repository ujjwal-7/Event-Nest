import {
  Button,
  Flex,
  Heading,
  Input,
  Radio,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverCloseButton,
  PopoverTrigger,
  Tag,
  TagLabel,
  useDisclosure,
  Collapse,
  IconButton,
  Stack,
  RadioGroup,
  Divider,
} from "@chakra-ui/react";
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { useState, useCallback } from "react";
import getAllCategories from "../utils/getAllCategories";
import { useNavigate } from "react-router-dom";

const Filters = ({ filters, setFilters }) => {
  const [tags, setTags] = useState(() => getAllCategories());
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${search}`);
    }
  };

  const handleClick = useCallback((id) => {
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === id ? { ...tag, isActive: !tag.isActive } : tag
      )
    );
  }, []);

  const handleTagClick = useCallback(
    (tag) => {
      setFilters((prevFilters) => {
        const newCategories = prevFilters.categories.includes(tag.name)
          ? prevFilters.categories.filter((category) => category !== tag.name) // Remove tag if it exists
          : [...prevFilters.categories, tag.name]; // Add tag if it does not exist

        return {
          ...prevFilters,
          categories: newCategories,
        };
      });
      handleClick(tag.id);
    },
    [setFilters, handleClick]
  );

  const { isOpen, onToggle, getButtonProps } = useDisclosure();
  const buttonProps = getButtonProps({ onClick: onToggle });

  return (
    <Flex flexDirection="column" alignItems="center" mt="7" gap="7">
      <Flex w={["100%", "100%", "60%"]} gap="4" alignItems="center">
        <Flex
          alignItems="center"
          gap="3"
          h={["39", "45", "50"]}
          w="100%"
          p={["2", "3"]}
          border="1px solid black"
          rounded="md"
        >
          <IoSearchSharp size="24" />
          <Input
            value={search}
            name="search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyUp={handleSearch}
            fontSize={["15", "18"]}
            variant="unstyled"
            placeholder="Search for event, category or place"
          />
        </Flex>

        <Popover size={["sm"]} closeOnBlur={true}>
          <PopoverTrigger>
            <IconButton size={["md", "lg"]} aria-label="filter" icon={<FaFilter />} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Flex justifyContent="space-around" mt="7">
                <Flex flexDirection="column" flex="1" alignItems="flex-start">
                  <Heading size="sm" mb="3">
                    Date
                  </Heading>
                  <RadioGroup
                    name="date"
                    value={filters.dateSort}
                    onChange={(value) => {
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        dateSort: value,
                      }));
                    }}
                  >
                    <Stack>
                      <Radio size="md" value="asc" color="#00798a">
                        Ascending
                      </Radio>
                      <Radio size="md" value="desc" color="#00798a">
                        Descending
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
                <Divider
                  orientation="vertical"
                  border="1px solid rgb(46 62 72 / 12%)"
                  height="80px"
                />
                <Flex
                  flexDirection="column"
                  flex="1"
                  alignItems="flex-start"
                  pl="4"
                >
                  <Heading size="sm" mb="3">
                    Price
                  </Heading>
                  <RadioGroup
                    name="price"
                    value={filters.priceSort}
                    onChange={(value) => {
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        priceSort: value,
                      }));
                    }}
                  >
                    <Stack>
                      <Radio size="md" value="asc" color="#00798a">
                        Ascending
                      </Radio>
                      <Radio size="md" value="desc" color="#00798a">
                        Descending
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>

      <Flex flexDirection="column" alignItems="center" gap="7">
        <Collapse in={isOpen} animateOpacity startingHeight={76}>
          <Flex gap="3" flexWrap="wrap" justifyContent="center">
            {tags?.map((tag, index) => (
              <Tag
                key={index}
                name="categories"
                onClick={() => handleTagClick(tag)}
                size={["md", "lg"]}
                _hover={
                  tag.isActive
                    ? { cursor: "pointer", color: "white" }
                    : {
                        border: "1px solid #00798a",
                        color: "#00798a",
                        cursor: "pointer",
                      }
                }
                color={tag.isActive && "white"}
                bg={tag.isActive ? "#00798a" : "white"}
                variant="outline"
              >
                <TagLabel>{tag.name}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </Collapse>

        <Button
          rightIcon={isOpen ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
          bg="none"
          border="none"
          color="#00798a"
          w={["30%", "20%", "10%"]}
          {...buttonProps}
        >
          {isOpen ? "Less" : "More"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Filters;
