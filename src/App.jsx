import React, { useState, useRef, useEffect } from 'react';
import './App.css';

export default function DictionaryApp() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const resultRef = useRef(null);

  const handleSearch = async () => {
    if (word.trim() === '') {
      setError('Please enter a word to search.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (data.title === "No Definitions Found") {
        setError('No definitions found. Try another word.');
      } else {
        setResult(data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setWord('');
    setResult(null);
    setError('');
  };

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

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
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={handleClear}>Clear</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="result-box" ref={resultRef}>
          <h2>Results for: {word}</h2>
          {result.meanings.map((meaning, index) => (
            <div key={index} className="definition">
              <p><strong>Part of Speech:</strong> {meaning.partOfSpeech}</p>
              <p><strong>Definition:</strong> {meaning.definitions[0].definition}</p>
              {meaning.definitions[0].example && (
                <p><strong>Example:</strong> {meaning.definitions[0].example}</p>
              )}
              <p><strong>Synonyms:</strong> {meaning.synonyms.length > 0 ? meaning.synonyms.join(', ') : 'No synonyms available.'}</p>
              <p><strong>Antonyms:</strong> {meaning.antonyms.length > 0 ? meaning.antonyms.join(', ') : 'No antonyms available.'}</p>
            </div>
          ))}
        </div>
      )}

      <button
        className="scroll-top"
        onClick={scrollTop}
        style={{ display: showScroll ? 'flex' : 'none' }}
      >
        ↑
      </button>
    </div>
  );
}