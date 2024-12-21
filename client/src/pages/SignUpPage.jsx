import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
  InputRightElement,
} from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import { IoMdKey, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateSignUpData } from "../utils/signUpValidation";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignUpData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.explaination || "An error occurred");
      }

      const data = await response.json();
      toast({
        title: "Signed up successfully",
        status: "success",
        isClosable: true,
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
      console.error("Error ->", error);
    }
  };

  return (
    <Center display="flex" flexDirection="column">
      <Flex
        flexDirection="column"
        gap="10"
        w={["100%", "70%", "50%", "40%"]}
        mt="12"
      >
        <Box flexDirection="column" gap="5">
          <Heading color="rgb(246 88 88)">Meetup</Heading>
          <Heading>Sign up</Heading>
        </Box>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            isRequired
          />
          {errors.firstName && (
            <Text color="red.500" mt="2">
              {errors.firstName}
            </Text>
          )}

          <Input
            type="text"
            name="lastName"
            placeholder="Last name"
            mt="7"
            value={formData.lastName}
            onChange={handleChange}
            isRequired
          />
          {errors.lastName && (
            <Text color="red.500" mt="2">
              {errors.lastName}
            </Text>
          )}

          <InputGroup mt="7">
            <InputLeftElement pointerEvents="none">
              <MdEmail size="18" color="#00798a" />
            </InputLeftElement>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              isRequired
            />
          </InputGroup>
          {errors.email && (
            <Text color="red.500" mt="2">
              {errors.email}
            </Text>
          )}

          <InputGroup mt="7">
            <InputLeftElement pointerEvents="none">
              <FaPhone size="16" color="#00798a" />
            </InputLeftElement>
            <Input
              type="tel"
              name="mobile"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              isRequired
            />
          </InputGroup>
          {errors.mobile && (
            <Text color="red.500" mt="2">
              {errors.mobile}
            </Text>
          )}

          <InputGroup mt="7">
            <InputLeftElement pointerEvents="none">
              <IoMdKey size="24" color="#00798a" />
            </InputLeftElement>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              isRequired
            />
            <InputRightElement
              cursor="pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <IoMdEye size="20" color="#00798a" />
              ) : (
                <IoMdEyeOff size="20" color="#00798a" />
              )}
            </InputRightElement>
          </InputGroup>
          {errors.password && (
            <Text color="red.500" mt="2">
              {errors.password}
            </Text>
          )}

          <InputGroup mt="7">
            <InputLeftElement pointerEvents="none">
              <IoMdKey size="24" color="#00798a" />
            </InputLeftElement>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              isRequired
            />
            <InputRightElement
              cursor="pointer"
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
            >
              {showConfirmPassword ? (
                <IoMdEye size="20" color="#00798a" />
              ) : (
                <IoMdEyeOff size="20" color="#00798a" />
              )}
            </InputRightElement>
          </InputGroup>
          {errors.confirmPassword && (
            <Text color="red.500" mt="2">
              {errors.confirmPassword}
            </Text>
          )}

          <Button
            type="submit"
            w="100%"
            mt="10"
            bg="rgb(246 88 88)"
            color="white"
            _hover={{ bg: "rgb(240 67 67)" }}
          >
            Sign up
          </Button>
        </form>

        <Box>
          <Text>
            Already a member?{" "}
            <Link to="/login" style={{ color: "blue" }}>
              Log in
            </Link>
          </Text>
        </Box>
      </Flex>
    </Center>
  );
};

export default SignUpPage;
