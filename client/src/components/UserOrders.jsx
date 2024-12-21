import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
} from "@chakra-ui/react";
import useFetchUserOrders from "../hooks/useFetchUserOrders";
import NoResults from "./NoResults";
import Pagination from "./Pagination";
import { useState } from "react";

const UserOrders = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { orders, totalPages, isLoading, error } = useFetchUserOrders(
    userId,
    currentPage
  );

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  if (orders?.length === 0) {
    return <NoResults message="You have no orders." />;
  }

  return (
    <>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Order id</Th>
              <Th>Event</Th>
              <Th>Tickets</Th>
              <Th>Price</Th>
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
                  </Tr>
                ))
              : orders?.map((order) => {
                  return (
                    <Tr key={order.id}>
                      <Td>{order.orderId}</Td>
                      <Td>{order.event.title}</Td>
                      <Td>{order.quantity}</Td>
                      <Td>{order.totalCost}</Td>
                    </Tr>
                  );
                })}
          </Tbody>
        </Table>
      </TableContainer>
      {orders != null ? (
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

export default UserOrders;
