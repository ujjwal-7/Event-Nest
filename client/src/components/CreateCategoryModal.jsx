import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const CreateCategoryModal = ({ isOpen, onClose, refetch }) => {
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_BASE_URL}/categories/create`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          method: "POST",
          body: JSON.stringify(category),
        }
      );

      const data = await result.json();
      if (!data.success) {
        throw new Error(data.explaination);
      }

      toast({
        title: data.message,
        status: "success",
        isClosable: true,
      });

      refetch();
      onClose();
      setCategory({
        name: "",
        category: "",
      });

    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
      setCategory({
        name: "",
        category: "",
      });
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => {
      return {
        ...prevCategory,
        [name]: value,
      };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="80%">
        <ModalHeader>Create new category</ModalHeader>

        <ModalBody>
          <Input
            type="text"
            name="name"
            required
            value={category.name}
            placeholder="Category name"
            onChange={handleChange}
          />

          <Textarea
            type="text"
            name="description"
            required
            mt={3}
            value={category.description}
            placeholder="Category description"
            onChange={handleChange}
          />
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button
            w={["30%", "24%", "18%"]}
            variant="outline"
            border="2px solid #00798a"
            color="#00798a"
            _hover={{ bg: "#00798a", color: "white", variant: "solid" }}
            mr={3}
            onClick={handleSubmit}
          >
            Create
          </Button>
          <Button
            w={["30%", "24%", "18%"]}
            variant="outline"
            border="2px solid #00798a"
            color="#00798a"
            _hover={{ bg: "#00798a", color: "white", variant: "solid" }}
            mr={3}
            onClick={() => {
              setCategory({
                name: "",
                description: "",
              });
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCategoryModal;
