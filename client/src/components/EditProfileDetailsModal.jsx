import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const EditProfileDetailsModal = ({ userId, isOpen, onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
  const toast = useToast();

  const [profileDetails, setProfileDetails] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      
      if(!profileDetails.email || !profileDetails.firstName || !profileDetails.lastName) {
        throw new Error("All fields are required.");
      }
      
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${userId}/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          method: "PUT",
          body: JSON.stringify(profileDetails),
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.data.explaination);
      }

      onClose();

      const { email, firstName, lastName } = result.data;
      updateUser({ email, firstName, lastName });
      toast({
        title: result.message,
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      onClose();
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails((prevProfileDetails) => {
      return {
        ...prevProfileDetails,
        [name]: value,
      };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="80%">
        <ModalHeader>Edit profile details</ModalHeader>

        <ModalBody>
          <Input
            type="email"
            name="email"
            required
            value={profileDetails.email}
            placeholder="Email"
            onChange={handleChange}
          />

          <Input
            type="text"
            name="firstName"
            mt={4}
            isRequired
            value={profileDetails.firstName}
            placeholder="First name"
            onChange={handleChange}
          />

          <Input
            type="text"
            name="lastName"
            required
            mt={4}
            value={profileDetails.lastName}
            placeholder="Last name"
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
            Save
          </Button>
          <Button
            w={["30%", "24%", "18%"]}
            variant="outline"
            border="2px solid #00798a"
            color="#00798a"
            _hover={{ bg: "#00798a", color: "white", variant: "solid" }}
            mr={3}
            onClick={() => {
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

export default EditProfileDetailsModal;
