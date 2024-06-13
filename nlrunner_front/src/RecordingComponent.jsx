import React, { useState, useRef } from 'react';
import { startRecording } from './recording'; // 녹음 기능을 포함하는 파일

const RecordingComponent = () => {
  const [recordingStatus, setRecordingStatus] = useState('');
  const [recordedText, setRecordedText] = useState('');
  const canvasRef = useRef(null);

  const handleClick = (event) => {
    event.preventDefault();
    startRecording(setRecordingStatus, setRecordedText, canvasRef); // canvasRef 전달
  };

  return (
    <div>
      <header>
        <h1>녹음하기</h1>
        <canvas ref={canvasRef} width="640" height="100" style={{ border: '1px solid black' }}></canvas>
        <a id="recording-button" href="#" onClick={handleClick}>녹음하기</a>
        <p>{recordingStatus}</p>
        <p>{recordedText}</p>
      </header>
    </div>
  );
};

export default RecordingComponent;