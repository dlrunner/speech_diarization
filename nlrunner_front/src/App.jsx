import React, { useState } from 'react';
import './App.css';
import RecordingComponent from './RecordingComponent'; // 녹음 컴포넌트 임포트

const App = () => {
  const [file, setFile] = useState(null);
  const [speakerTexts, setSpeakerTexts] = useState(null);
  const [textDownloadLinks, setTextDownloadLinks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // 파일 선택시 실행되는 함수
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // 업로드 할때 실행되는 함수
  const handleSubmit = async () => {
    if (!file) {
      alert('파일을 선택하세요.');
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/uploadfile/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setSpeakerTexts(data.speaker_texts);
      setTextDownloadLinks(data.text_download_links);
      setDuration(data.duration.toFixed(1));
      setFileName(data.org_filename);
    } catch (error) {
      console.error('Error:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingClick = () => {
    setIsRecording(true); // 녹음 상태로 전환
  };

  const downloadFile = async (speakerId) => {
    const downloadData = {
        filename: fileName,
        speaker_id: speakerId
    }

    try {
      const response = await fetch('http://localhost:8000/api/download_txt/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(downloadData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}_${speakerId}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to download file');
        alert('파일 다운로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      {isRecording ? (
        <RecordingComponent /> // 녹음 컴포넌트 렌더링
      ) : (
        <>
          <h1>목소리필터 서비스</h1>
          <button onClick={handleRecordingClick}>녹음</button>
          <input type="file" accept='.wav' onChange={handleFileChange} />
          <button onClick={handleSubmit} disabled={!file}>
            {isLoading ? '로딩 중...잠시만 기다려주세요!' : '업로드'}
          </button>
          {speakerTexts && (
            <div>
              <h2>화자 분리 결과</h2>
              <h4>소요시간: {duration}초</h4>
              {Object.entries(speakerTexts).map(([speakerId, texts]) => (
                <div key={speakerId}>
                  <h3>Speaker {speakerId}</h3>
                  <ul>
                    {texts.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                  {textDownloadLinks && textDownloadLinks[speakerId] && (
                    <button onClick={() => downloadFile(speakerId)}>Speaker{speakerId}.txt</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
