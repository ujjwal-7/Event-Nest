// CreateEventPage.js
import { useContext, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import useFetchCategories from "../hooks/useFetchCategories";
import eventDataValidation from "../utils/eventDataValidation";
import EventTitleInput from "../components/EventTitleInput";
import DateInput from "../components/DateInput";
import CategorySelect from "../components/CategorySelect";
import AddressForm from "../components/AddressForm";
import EventImageUpload from "../components/EventImageUpload";
import EventDetailsEditor from "../components/EventDetailsEditor";
import TimeInput from "../components/TimeInput";
import { useNavigate } from "react-router-dom";
import CreateCategoryModal from "../components/CreateCategoryModal";
import { AuthContext } from "../context/AuthContext";

const CreateEventPage = () => {
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    startDate: new Date(),
    endDate: new Date(),
    startTime: "10:00",
    endTime: "12:00",
    price: 0,
    seats: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user} = useContext(AuthContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const { categories, refetch } = useFetchCategories();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setEventFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setEventFormData((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [field]: value,
      },
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validationErrors = eventDataValidation(eventFormData, selectedFile);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const formData = new FormData();
      formData.append("event-image", selectedFile);

      for (let key in eventFormData) {
        if (typeof eventFormData[key] === "object") {
          formData.append(key, JSON.stringify(eventFormData[key]));
        } else {
          formData.append(key, eventFormData[key]);
        }
      }

      const result = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/create`,
        {
          headers: {
            "Authorization": `Bearer ${user.token}` 
          },
          method: "POST",
          body: formData,
        }
      );

      const data = await result.json();
      if (!data.success) {
        throw new Error(data.explaination);
      }

      toast({
        title: "Event created successfully",
        status: "success",
        isClosable: true,
      });

      navigate(`/events/${data.data.id}`);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <EventTitleInput
        value={eventFormData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        error={errors.title}
      />

      <Flex
        flexDirection={["column", "column", "row"]}
        justifyContent="space-between"
        mt="7"
        gap="4"
      >
        <DateInput
          label="Start Date"
          selectedDate={eventFormData.startDate}
          onChange={(date) => handleInputChange("startDate", date)}
          minDate={new Date()}
          error={errors.startDate}
        />
        <DateInput
          label="End Date"
          selectedDate={eventFormData.endDate}
          onChange={(date) => handleInputChange("endDate", date)}
          minDate={eventFormData.startDate}
          error={errors.endDate}
        />
      </Flex>

      <Flex
        flexDirection={["column", "column", "row"]}
        justifyContent="space-between"
        mt="7"
        gap="4"
      >
        <TimeInput
          label="Start Time"
          value={eventFormData.startTime}
          onChange={(time) => handleInputChange("startTime", time)}
          error={errors.startTime}
        />
        <TimeInput
          label="End Time"
          value={eventFormData.endTime}
          onChange={(time) => handleInputChange("endTime", time)}
          error={errors.endTime}
        />
      </Flex>

      <Flex
        flexDirection={["column", "column", "column", "row"]}
        mt="7"
        gap="2"
      >
        <CategorySelect
          categories={categories}
          value={eventFormData.categoryId}
          onChange={(e) => handleInputChange("categoryId", e.target.value)}
          error={errors.categoryId}
        />
        <Button w={["50%", "30%", "15%"]} onClick={onOpen}>
          Create category
        </Button>
        <CreateCategoryModal
          isOpen={isOpen}
          onClose={onClose}
          refetch={refetch}
        />
      </Flex>

      <Flex
        flexDirection={["column", "column", "column", "row"]}
        justifyContent="space-between"
        mt="7"
        gap="4"
      >
        <Flex
          gap="5"
          flexDirection={["column", "row"]}
          width={["100%", "55%", "35%"]}
          alignItems={["null", "center"]}
        >
          <Heading size="sm">Seats</Heading>
          <Input
            value={eventFormData.seats}
            onChange={(e) => handleInputChange("seats", e.target.value)}
            isInvalid={!!errors.seats}
          />
          {errors.seats && <Text color="red.500">{errors.seats}</Text>}
        </Flex>

        <Flex
          gap="5"
          flexDirection={["column", "row"]}
          width={["100%", "55%", "35%"]}
          alignItems={["null", "center"]}
        >
          <Heading size="sm">Price</Heading>
          <Input
            value={eventFormData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            isInvalid={!!errors.price}
          />
          {errors.price && <Text color="red.500">{errors.price}</Text>}
        </Flex>
      </Flex>

      <AddressForm
        address={eventFormData.address}
        onChange={handleAddressChange}
        errors={errors}
      />

      <EventImageUpload
        onChange={handleFileChange}
        selectedFile={selectedFile}
        error={errors.eventImage}
      />

      <EventDetailsEditor
        value={eventFormData.description}
        onChange={(value) => handleInputChange("description", value)}
        error={errors.description}
      />

      <Button
        mt="8"
        w={["40%", "24%", "18%"]}
        variant="outline"
        border="2px solid #00798a"
        color="#00798a"
        _hover={{ bg: "#00798a", color: "white", variant: "solid" }}
        type="submit"
        isLoading = {isSubmitting}
        loadingText='Submitting'
      >
        Create Event
      </Button>
    </form>
  );
};

export default CreateEventPage;
