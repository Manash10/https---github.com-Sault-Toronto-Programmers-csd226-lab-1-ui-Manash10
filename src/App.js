import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [word, setWord] = useState('');
  const [rating, setRating] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const maxGuesses = 5;

  useEffect(() => {
    fetch('http://localhost:8000/api/start')
      .then(response => response.json())
      .then(data => {
        setWord(data.word);
        setRating(data.rating);
        setGuesses([]);
        setInput('');
        setMessage('');
      });
  }, []);

  const handleGuess = () => {
    if (input.length !== 5) {
      setMessage('Guess must be exactly 5 letters long.');
      return;
    }

    const newGuesses = [...guesses, input];
    setGuesses(newGuesses);
    setInput('');

    if (input.toUpperCase() === word.toUpperCase()) {
      setMessage('WIN!');
      return;
    }

    if (newGuesses.length >= maxGuesses) {
      setMessage(`LOSE! The word was: ${word}`);
      return;
    }

    setMessage('');
  };

  const renderGuess = (guess, index) => {
    return (
      <div key={index} className="guess-row">
        {guess.split('').map((letter, i) => {
          let className = 'letter';
          if (letter.toUpperCase() === word[i].toUpperCase()) {
            className += ' correct';
          } else if (word.toUpperCase().includes(letter.toUpperCase())) {
            className += ' present';
          } else {
            className += ' absent';
          }
          return <div key={i} className={className}>{letter}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Word Guessing Game</h1>
      <p>Rating: {rating}</p>
      <div className="guesses">
        {guesses.map((guess, index) => renderGuess(guess, index))}
        {guesses.length < maxGuesses && (
          <div className="guess-row">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="letter">{input[i] || ''}</div>
            ))}
          </div>
        )}
      </div>
      {message && <p>{message}</p>}
      {guesses.length < maxGuesses && !message.includes('WIN') && (
        <div className="input">
          <input
            type="text"
            maxLength="5"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
          />
          <button onClick={handleGuess}>Submit Guess</button>
        </div>
      )}
    </div>
  );
};

export default App;
