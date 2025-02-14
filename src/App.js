import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // Pour gérer les erreurs

  // Appel à l'API backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/message');

        // Vérification de la réponse
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response:', result); // Affiche la réponse pour debugging
        setData(result); // Mise à jour de l'état avec la réponse
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Une erreur s\'est produite lors de la récupération des données.');
      }
    };

    fetchData();
  }, []); // Le tableau vide [] signifie que l'effet se déclenche uniquement au montage du composant

  return (
    <div className="App">
      <header className="App-header">
        <h1>IA Crypto - Découvre les tendances d'évolutions de Solana !</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affiche l'erreur si présente */}
        <p>{data ? data.message : 'Chargement en cours...'}</p> {/* Affiche le message ou "Chargement..." */}
      </header>
    </div>
  );
}

export default App;
