
import React, { useState, useRef } from 'react'
import './App.css'
import RecordingComponent from './RecordingComponent.jsx'; // 녹음 컴포넌트 임포트


const App = () => {
    const [file, setFile] = useState(null);
    const [speakerTexts, setSpeakerTexts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        setIsLoading(true); // 로딩 시작
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
            setDuration(data.duration.toFixed(1));
            setFileName(data.org_filename);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false); // 로딩 종료
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
        <div className="app-container">
            <Header />
            <main className="main-content">
                <h1 style={{ color: 'pink' }}>목소리 필터 서비스</h1>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleSubmit} disabled={!file}>
                    {isLoading ? '로딩 중... 잠시만 기다려주세요!' : '업로드'}
                </button>
                {speakerTexts && (
                    <div>
                        <h2>화자 분리 결과</h2>
                        {Object.keys(speakerTexts).map((speakerId) => (
                            <div key={speakerId}>
                                <h3>Speaker {speakerId}</h3>
                                <ul>
                                    {speakerTexts[speakerId].map((text, index) => (
                                        <li key={index}>{text}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                    </div>
                )}
            </main>
            <Footer />
        </div>
      );
    };

export default App;