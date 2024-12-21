import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <Box mt="64px" minH="100vh" maxW="6xl" mx="auto" p="4" mb="10">
        {children}
      </Box>
      {["/order", "/success", "/cancel"].includes(location.pathname) ? null : (
        <Footer />
      )}
    </>
  );
};

export default Layout;
