import React, { useState } from 'react';
import './App.css';

export default function DictionaryApp() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (word.trim() === '') {
      setError('Please enter a word to search.');
      setResult(null);
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (data.title === "No Definitions Found") {
        setError('No definitions found. Try another word.');
        setResult(null);
      } else {
        setResult(data[0]);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Something went wrong. Try again later.');
      setResult(null);
    }
  };

  return (
    <div className="container">
      <h1 className="title">📖 Dictionary App 📖</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Type a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="result-box">
          <h2>Results for: {word}</h2>
          <div className="definition">
            <p><strong>Part of Speech:</strong> {result.meanings[0].partOfSpeech}</p>
            <p><strong>Definition:</strong> {result.meanings[0].definitions[0].definition}</p>
            {result.meanings[0].definitions[0].example && (
              <p><strong>Example:</strong> {result.meanings[0].definitions[0].example}</p>
            )}
            <p><strong>Synonyms:</strong> {result.meanings[0].synonyms.length > 0 ? result.meanings[0].synonyms.join(', ') : 'No synonyms available.'}</p>
            <p><strong>Antonyms:</strong> {result.meanings[0].antonyms.length > 0 ? result.meanings[0].antonyms.join(', ') : 'No antonyms available.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}