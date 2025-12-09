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
import "./OpponentsTable.css";

const OpponentsTable = ({ selectedOpponent, setSelectedOpponent, opponents }) => {

  const handleSelect = (item) => {
    setSelectedOpponent(item.name);
  };

  return (
    <TableContainer className="opponents-table">
      <Table variant="simple" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Oponentes Disponíveis</Th>
          </Tr>
        </Thead>

        <Tbody>
          {opponents.map((item) => (
            <Tr
              key={
                item.type === "player"
                  ? item.playerUuid
                  : item.name
              }
              className={
                "tr " +
                (selectedOpponent === item.name ? "selected" : "unselected")
              }
              onClick={() => handleSelect(item)}
              style={{ cursor: "pointer" }}
            >
              <Td className="td">
                {item.type === "player"
                  ? `[PLAYER] ${item.name} (${item.score ?? 0})`
                  : `[BOT] ${item.name} (${item.score ?? 0})`
                }
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default OpponentsTable;