import React, {useState} from'react';

import StockDisplay from "./components/StockDisplay";
import SearchBar from "./components/SearchBar";
import './App.css';

function App() {

  const [stock, setStock] = useState('');

  const handleSearch = (codigoAcao)=> {
    setStock(codigoAcao);
  }

  return (
    <div className="App">
      <h1>Cálculo Preço Teto de Ações</h1>
      <SearchBar onSearch={handleSearch}/>
      <StockDisplay stock={stock} />
    </div>
  );
}

export default App;
