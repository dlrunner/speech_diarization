import React, { useState, useRef } from 'react'
import './App.css'
import RecordingComponent from './RecordingComponent.jsx'; // 녹음 컴포넌트 임포트

const App = () => {
    const [file, setFile] = useState(null);
    const [speakerTexts, setSpeakerTexts] = useState(null);
    const [textDownloadLinks, setTextDownloadLinks] = useState(null);
    const [isLoading, setIsLoding] = useState(false);
    const [duration, setDuration] = useState(null); //소요시간 표시용
    const [fileName, setFileName] = useState(null);
    const [isRecording, setIsRecording] = useState(false); // 녹음 상태 추가

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        setIsLoding(true); //로딩 시작
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/uploadfile/', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log('API Response : ', data);
            setSpeakerTexts(data.speaker_texts);
            // setTextDownloadLinks(data.text_download_links);
            setDuration(data.duration.toFixed(1));
            setFileName(data.org_filename);
        } catch (error) {
            console.error('Error:', error);
        } finally {
          setIsLoding(false); // 로딩 종료
        }
    };
    
    const handleRecordingClick = () => {
        setIsRecording(true); // 녹음 상태로 전환
      };

    const txtDownload = async (speakerId) => {
        const downloadData = {
            filename: fileName,
            speaker_id: speakerId
        }
        const response = await fetch('/api/download_txt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadData),
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.split('_')[0]}_${speakerId}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const wavDownload = async (speakerId) => {
        const downloadData = {
            filename: fileName,
            speaker_id: speakerId
        }
        const response = await fetch('/api/download_wav/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadData),
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.split('_')[0]}_${speakerId}.wav`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

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
                  <h4>소요시간 : {duration}초</h4>
                  {Object.entries(speakerTexts).map(([speakerId, texts]) => (
                    <div key={speakerId}>
                      <h3>Speaker {speakerId}</h3>
                      <ul>
                        {texts.map((text, index) => (
                          <li key={index}>{text}</li>
                        ))}
                      </ul>
                      <h2>파일 다운로드</h2>
                        <button onClick={() => txtDownload(speakerId)}>TXT 파일 다운로드</button>
                        <button onClick={() => wavDownload(speakerId)}>통합 음성파일 다운로드</button>
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