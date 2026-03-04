import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  List,
  ListItem,
  Checkbox,
  Input,
} from "@chakra-ui/react";
import "./TransferListFragment.css";

const TransferListFragment = ({
  content,
  selectedItems,      
  setSelectedItems,   
}) => {
  const [visibleContent, setVisibleContent] = useState(content);
  const [inputContent, setInputContent] = useState("");

  useEffect(() => {
    setVisibleContent(content);
    if(inputContent !== "") handleInputChange(inputContent);
  }, [content]);

  const handleInputChange = (name) => {
    setInputContent(name);
    const newBotsList = content.filter((botName) =>
      botName.toLowerCase().includes(name.toLowerCase())
    );
    setVisibleContent(newBotsList);
  };

  const handleCheckboxChange = (bot) => {
    let newSelection = [...selectedItems];
    if (newSelection.includes(bot)) {
      newSelection = newSelection.filter((b) => b !== bot);
    } else {
      newSelection.push(bot);
    }
    setSelectedItems(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === visibleContent.length && visibleContent.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...visibleContent]);
    }
  };

  const isAllSelected = visibleContent.length > 0 && selectedItems.length === visibleContent.length;

  return (
    <ChakraProvider>
      <div className="transfer-list-fragment">
        <div className="list-header">
            <p>Total: {content.length}</p>
            <Input
            className="bot-filter"
            onChange={(e) => handleInputChange(e.target.value)}
            value={inputContent}
            placeholder="Buscar..."
            size="sm"
            />
            <button
            type="button"
            className="btn btn-dark select-all"
            onClick={(e) => {
                e.preventDefault();
                toggleSelectAll();
            }}
            >
            {isAllSelected ? "Desmarcar Todos" : "Selecionar Todos"}
            </button>
        </div>

        <div className="list-limiter">
          <List spacing={2}>
            {visibleContent.map((bot) => (
              <ListItem key={bot}>
                <Checkbox
                  onChange={() => handleCheckboxChange(bot)}
                  isChecked={selectedItems.includes(bot)}
                >
                  {bot}
                </Checkbox>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default TransferListFragment;