import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';
import Player from './components/Player';

function App() {
  const [musicFiles, setMusicFiles] = useState([]);
  const [filteredMusicFiles, setFilteredMusicFiles] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMusicFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/music');
        setMusicFiles(response.data);
        setFilteredMusicFiles(response.data);
        setCurrentTrack(response.data[0]);
      } catch (error) {
        console.error('Error fetching music files:', error);
        setError('Error fetching music files. Please try again.');
      }
    };

    fetchMusicFiles();
  }, []);

  const playTrack = (track, index) => {
    setCurrentTrack(track);
    setCurrentIndex(index);
  };

  const handleNextTrack = () => {
    const nextIndex = (currentIndex + 1) % musicFiles.length;
    setCurrentTrack(musicFiles[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const handlePrevTrack = () => {
    const prevIndex = (currentIndex - 1 + musicFiles.length) % musicFiles.length;
    setCurrentTrack(musicFiles[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = musicFiles.filter(file => file.title.toLowerCase().includes(query) || file.artist.toLowerCase().includes(query));
    setFilteredMusicFiles(filtered);
  };

  const closePlayer = () => {
    setCurrentTrack(null);
  };

  return (
    <div className="app">
      <h1>Parallel World Player</h1>
      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Search for a song or artist..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      <ul className="song-list">
        {filteredMusicFiles.map((file, index) => (
          <li key={file.id} className="song-item">
            <div className="song-details">
              <span className="song-title">{file.title}</span>
              <span className="song-artist">{file.artist}</span>
            </div>
            <button onClick={() => playTrack(file, index)} className="play-button">Play</button>
          </li>
        ))}
      </ul>

      {currentTrack && (
        <Player
          track={currentTrack}
          onClose={closePlayer}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
        />
      )}
    </div>
  );
}

export default App;

