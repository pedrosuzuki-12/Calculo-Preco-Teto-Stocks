import React, { useState } from "react";
import PercentInput from './PercentInput';

const SearchBar =({ onSearch}) =>{

    const[input, setInput] = useState("");

    const handleKeyDown = (event) =>{
        if (event.key === "Enter" && input.trim()){
            onSearch(input.trim());
            setInput("");
        }
    }
return (
    <input
      type="text"
      placeholder="Digite o código da Ação"
      value={input}
      onChange={(event) => setInput(event.target.value)}
      onKeyDown={handleKeyDown}
      style={{ padding: "8px", width: "200px" }}
    />
  );
};

export default SearchBar;
