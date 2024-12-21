import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import {
  Box,
  OrderedList,
  ListItem,
  Flex,
  Heading,
  Text,
  Divider,
  Button,
  useToast
} from "@chakra-ui/react";
import { OrderContext } from "../context/OrderContext";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Order() {
  const { orderDetails,  updateOrderDetails } = useContext(OrderContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const navigate = useNavigate();

  const initialOptions = {
    "client-id": import.meta.env.REACT_APP_CLIENT_ID,
    "enable-funding": "venmo",
    "disable-funding": "",
    country: "US",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  };

  const createOrder = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/orders/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}` 
          },
          body: JSON.stringify({
            order: {
              eventId: orderDetails.eventId,
              price: orderDetails.price,
              quantity: orderDetails.quantity,
            },
          }),
        }
      );

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error(orderData.explaination);
      }

      if (!orderData.data.paymentGatewayOrderId) {
        updateOrderDetails(null);
        navigate("/success");
        return;
      }
      return orderData.data.paymentGatewayOrderId;
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong",
        status: "error",
        isClosable: true,
      });
      
    }
  };

  const onApprove = async (data, actions) => {
    try {
      
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/orders/${data.orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orderData = await response.json();

      if (!orderData.success) {
        if (orderData.explaination === "INSTRUMENT_DECLINED") {
          return actions.restart();
        } else {
          throw new Error("Transaction failed");
        }
      }

      const transaction = orderData.data.purchase_units[0].payments.captures[0];

      updateOrderDetails(null);
      navigate("/success");
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong",
        status: "error",
        isClosable: true,
      });
      navigate("/cancel");
    }
  };

  return (
    <>
      <Flex flexDirection={["column", "column", "row"]} gap="7" mt="10">
        <Box w={["100%", "100%", "60%"]} boxShadow="lg" p="3">
          <Heading size="md" m="5">
            Ticket information
          </Heading>
          <OrderedList spacing="3" pl="5">
            <ListItem>
              Customer(s) will receive an order confirmation via email, which
              must be presented at the pick up counter to collect your
              ticket(s).
            </ListItem>
            <ListItem>
              You will have to pickup your tickets from the following address on
              the specified date & time:
            </ListItem>
            <ListItem>
              To collect tickets, the individual who made the purchase must
              present themselves at the counter with their ID and a copy of the
              transaction confirmation. If the original purchaser cannot collect
              the tickets, their proxy must bring a photocopy of the
              confirmation along with a signed authorization letter and their
              own ID.
            </ListItem>
          </OrderedList>
        </Box>

        <Flex
          w={["100%", "100%", "40%"]}
          flexDirection="column"
          gap="4"
          boxShadow="lg"
          p="3"
        >
          <Flex flexDirection="column" gap="2">
            <Heading size="md">{orderDetails.eventTitle}</Heading>
            <Divider border="1px solid #c4c3c0" />
            <Text>{orderDetails.eventDate}</Text>
            <Text>{orderDetails.eventStartTime}</Text>
            <Text>
                {`${orderDetails.eventAddress.city}, ${orderDetails.eventAddress.state}, ${orderDetails.eventAddress.postalCode} ${orderDetails.eventAddress.country}`}
            </Text>
            <Divider border="1px solid #c4c3c0" />
            <Flex justifyContent="space-between">
              <Text>Price</Text>
              <Text>${orderDetails.price}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Tickets</Text>
              <Text>{orderDetails.quantity}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Total</Text>
              <Text>${orderDetails.quantity * orderDetails.price}</Text>
            </Flex>
          </Flex>
          <Divider border="1px solid #c4c3c0" />

          {orderDetails.quantity * orderDetails.price === 0 ? (
            <Button bg="rgb(246 88 88)" color="white" _hover={{ bg: "rgb(240 67 67)"}} onClick={createOrder}>Confirm</Button>
          ) : (
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{
                  shape: "rect",
                  layout: "vertical",
                  color: "gold",
                  label: "paypal",
                }}
                createOrder={createOrder}
                onApprove={onApprove}
              />
            </PayPalScriptProvider>
          )}
          <Box >
          <Text color="red" fontSize={18}>PayPal test credentials</Text>
          <Text fontSize={16}>Email : sb-rad8x31465788@business.example.com</Text>
          <Text fontSize={16}>Password : B>IhUgB7</Text>
        </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default Order;
