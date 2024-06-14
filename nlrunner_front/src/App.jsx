// App.jsx
import React, { useState } from 'react';
import './App.css';
// import Header from './layout/header';
// import Footer from './layout/footer';

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
            const response = await fetch('http://localhost:8000/api/uploadfile/', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            // console.log('API Response : ', data);
            setSpeakerTexts(data.speaker_texts);
            setTextDownloadLinks(data.text_download_links);
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
    // const downloadFile = async (fileLink) => {
    //     try {
    //         const response = await fetch(fileLink);
    //         const text = await response.text();
    //         const blob = new Blob([text], { type: 'text/plain' });
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'filename.txt');
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };
    const downloadFile = async (speakerId) => {
        const downloadData = {
            filename: fileName,
            speaker_id: speakerId
        }
        const download = await fetch('http://localhost:8000/api/download_txt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadData),
        });
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
