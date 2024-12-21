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
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.explaination);
      }

      toast({
        title: "Logged in successfully",
        status: "success",
        isClosable: true,
      });

      handleLogin(data.data);
      navigate("/");

    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
      
    }
  };

  return (
    <>
      <Center display="flex" flexDirection="column">
        <Flex
          flexDirection="column"
          gap="10"
          w={["100%", "70%", "50%", "40%"]}
          mt="12"
        >
          <Box flexDirection="column" gap="5">
            <Heading color="rgb(246 88 88)">Meetup</Heading>
            <Heading>Log in</Heading>
          </Box>

          <form onSubmit={handleSubmit}>
            <InputGroup>
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

            <Button
              w="100%"
              type="submit"
              mt="10"
              bg="rgb(246 88 88)"
              color="white"
              _hover={{ bg: "rgb(240 67 67)" }}
            >
              Log in
            </Button>
          </form>

          <Box>
            <Text>
              Not a member yet?{" "}
              <Link to="/signup" style={{ color: "blue" }}>
                Sign up
              </Link>
            </Text>

            <Box mt="5">
              <Text display="block" as="b">
                Demo account: testuserdev07@gmail.com
              </Text>
              <Text as="b">Password: Test123#</Text>
            </Box>
          </Box>
        </Flex>
      </Center>
    </>
  );
};

export default LoginPage;
