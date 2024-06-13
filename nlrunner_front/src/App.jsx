import React, { useState } from 'react'
import './App.css'

const App = () => {
    const [file, setFile] = useState(null);
    const [speakerTexts, setSpeakerTexts] = useState(null);
    const [textDownloadLinks, setTextDownloadLinks] = useState(null);
    const [isLoading, setIsLoding] = useState(false);
    const [duration, setDuration] = useState(null); //소요시간 표시용
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('파일을 확인해주세요.');
            return;
        }

        setIsLoding(true); //로딩 시작
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
        } finally {
          setIsLoding(false); // 로딩 종료
        }
    };

    const downloadFile = async (fileLink) => {
        try {
            const response = await fetch(fileLink);
            const text = await response.text();
            const blob = new Blob([text], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'filename.txt');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>목소리필터 서비스</h1>
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
                        </div>
                    ))}
                </div>
            )}
            {textDownloadLinks && (
                <div>
                    <h2>다운로드 가능한 TXT 파일</h2>
                    <ul>
                    {/* {Object.entries(textDownloadLinks).map(([speakerId, fileLink]) => (
                        <li key={speakerId}>
                            Speaker {speakerId}: <a href={fileLink} download>다운로드 TXT 파일</a>
                        </li>
                    ))} */}
                    {Object.entries(textDownloadLinks).map(([speakerId, fileLink]) => (
                            <li key={speakerId}>
                                Speaker {speakerId}: <button onClick={() => downloadFile(fileLink)}>다운로드 TXT 파일</button>
                            </li>
                    ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;
