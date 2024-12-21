import { Box, Heading, Text } from "@chakra-ui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EventDetailsEditor = ({ value, onChange, error }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "align",
    "link",
    "image",
  ];

  return (
    <Box mt="7">
      <Heading mb="3" size="sm">
        Event details
      </Heading>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
      {error && <Text color="red.500">{error}</Text>}
    </Box>
  );
};

export default EventDetailsEditor;
