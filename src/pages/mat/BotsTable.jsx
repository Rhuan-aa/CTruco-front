import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import "./BotsTable.css";

const BotsTable = ({ selectedBot, setSelectedBot, bots }) => {
  const handleClick = (event) => {
    event.preventDefault();
    setSelectedBot(event.target.innerText);
  };

  return (
    <TableContainer className="bots-table">
      <Table variant="simple" colorScheme="gray">
        <Thead>
          <Tr>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {bots.map((name) => (
            <Tr
              key={name}
              className={
                "tr " + (selectedBot === name ? "selected" : "unselected")
              }
              onClick={(e) => handleClick(e)}
            >
              <Td className="td">
                <a href="/">{name}</a>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BotsTable;