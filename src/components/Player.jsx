import React, { useRef, useEffect, useState } from 'react';

const Player = ({ track, onClose, onNext, onPrev }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });
      audioRef.current.addEventListener('ended', onNext);
    }
  }, [track, onNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [track]);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e) => {
    const progress = e.nativeEvent.offsetX / e.target.offsetWidth;
    audioRef.current.currentTime = progress * duration;
  };

  return (
    <div className="player-popup">
      <div className="player-header">
        <h2 className="song-title">{track.title}</h2><br></br>
        
      </div>
      <p className="song-title">click ⏸️ play</p>
      <div className="player-controls">
        <button onClick={onPrev} className="control-button">⏮️</button>
        <button onClick={togglePlayPause} className="control-button">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={onNext} className="control-button">⏭️</button>
      </div>
      <div className="player-timing">
        <span>{formatTime(currentTime)}</span>
        <div className="progress-bar" onClick={handleProgressClick}>
          <div
            className="progress"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <span>{formatTime(duration)}</span>
      </div>
      <audio ref={audioRef} controls className="audio-element" hidden>
        <source src={track.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;
