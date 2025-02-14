import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  // Appel à l'API backend (remplace l'URL par l'adresse réelle de ton backend)
  useEffect(() => {
    fetch('http://backend-service:3000/api/message')  // L'URL de ton API
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Test App!</h1>
        <p>
          {data ? data.message : 'Loading...'}
        </p>
      </header>
    </div>
  );
}


export default App;

