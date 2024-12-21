import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  Heading,
  Divider,
} from "@chakra-ui/react";
import Pagination from "../components/Pagination";
import NoResults from "../components/NoResults";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchEventOrders from "../hooks/useFetchEventOrders";
import { useNavigate } from "react-router-dom";
import useFetchEventDetails from "../hooks/useFetchEventDetails";

const OrderDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { orders, totalPages, isLoading, error } = useFetchEventOrders(
    eventId,
    currentPage
  );

  const { event } = useFetchEventDetails(eventId);
  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (error) {
      navigate("/");
    }
  }, [error, navigate]);

  return (
    <>
      <Heading size={["lg", "xl"]} mb={3}>{event?.title}</Heading>
      <Divider border="1px solid #c4c3c0" />
      <>
        {orders?.length === 0 ? (
          <NoResults message="No orders." />
        ) : (
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Order id</Th>
                  <Th>Email</Th>
                  <Th>Full name</Th>
                  <Th isNumeric>Tickets</Th>
                  <Th isNumeric>Price</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading || error
                  ? Array.from({ length: 20 }).map((_, index) => (
                      <Tr key={index}>
                        <Td>
                          <Skeleton height={2} />
                        </Td>
                        <Td>
                          <Skeleton height={2} />
                        </Td>
                        <Td>
                          <Skeleton height={2} />
                        </Td>
                        <Td>
                          <Skeleton height={2} />
                        </Td>
                        <Td>
                          <Skeleton height={2} />
                        </Td>
                      </Tr>
                    ))
                  : orders?.map((order) => {
                      return (
                        <Tr key={order.id}>
                          <Td>{order.orderId}</Td>
                          <Td>{order.user.email}</Td>
                          <Td>{`${order.user.firstName} ${order.user.lastName}`}</Td>
                          <Td isNumeric>{order.quantity}</Td>
                          <Td isNumeric>{order.totalCost}</Td>
                        </Tr>
                      );
                    })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </>
      {orders != null && orders.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      ) : null}
    </>
  );
};

export default OrderDetails;
