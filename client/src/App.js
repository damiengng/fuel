import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/post', { type: city });
      setResults(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  const handleChange = (e) => {
    setCity(e.target.value.toUpperCase()); // Convertir en majuscules
  };

  return (
    <div className="App">
      <h1>Recherche de prix des carburants par ville</h1>
      <input
        type="text"
        placeholder="Entrez le nom de la ville"
        value={city}
        onChange={handleChange} // Appeler la fonction handleChange lors du changement
      />
      <button onClick={handleSearch}>Rechercher</button>

      <h2>Prix du carburant à {city}</h2>
      <ul>
        {results.map((station, index) => (
          <li key={index}>
            {station.name && <p>Nom: {station.name}</p>}
            <p>Adresse: {station.address}</p>
            <p>Prix du gazole: {station.price_gazole}</p>
            <p>Prix du SP95: {station.price_sp95}</p>
            <p>Prix du SP98: {station.price_sp98}</p>
            <p>Prix du GPLc: {station.price_gplc}</p>
            <p>Prix du E10: {station.price_e10}</p>
            <p>Prix du E85: {station.price_e85}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
