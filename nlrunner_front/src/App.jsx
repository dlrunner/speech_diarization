import React, { useState } from 'react'
import './App.css'

const App = () => {
    const [file, setFile] = useState(null); //선택한 파일
    const [speakerTexts, setSpeakerTexts] = useState(null);  // 화자분리 결과
    const [isLoading, setIsLoding] = useState(false); // 로딩 상태

    //파일 선택시 실행되는 함수
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    //업로드 할때 실행되는 함수
    const handleSubmit = async () => {
        setIsLoding(true); //로딩 시작
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/uploadfile/', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setSpeakerTexts(data); //서버에서 받은 화자 분리 결과를 setSpeakerTexts에 담는다.
        } catch (error) {
            console.error('Error:', error);
        } finally {
          setIsLoding(false); // 로딩 종료
        }
    };

    return (
        <div>
            <h1>목소리필터 서비스</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit} disabled={!file}>
            {isLoading ? '로딩 중...잠시만 기다려주세요!' : '업로드'}
            </button>
            {speakerTexts && (
                <div>
                    <h2>화자 분리결과</h2>
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
        </div>
    );
};

export default App;
