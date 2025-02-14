import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  // Appel à l'API backend
  useEffect(() => {
    fetch('http://15.237.119.25:32653/api/message')  // Assure-toi d'utiliser l'URL de ton frontend ou du backend correct
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>IA Crypto - Découvre les tendances d'évolutions de Solana !</h1>
        <p>
          {data ? data.message : 'Loading... tkt ca arrive'}
        </p>
      </header>
    </div>
  );
}

export default App;
