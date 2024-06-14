import React, { useState, useRef } from 'react'
import logo from './logo.svg';
import './App2.css'
import RecordingComponent from './RecordingComponent.jsx'; // 녹음 컴포넌트 임포트

const App2 = () => {
    const [file, setFile] = useState(null);
    const [speakerTexts, setSpeakerTexts] = useState(null);
    const [textDownloadLinks, setTextDownloadLinks] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(null); // 소요시간 표시용
    const [fileName, setFileName] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file.name);
            setFile(file); // 파일 선택 시 상태 업데이트
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!file) {
            alert('파일을 선택해주세요.');
            return;
        }
    
        setIsLoading(true); // 로딩 시작
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await fetch('http://localhost:8000/api/uploadfile/', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('파일 업로드 중 오류가 발생하였습니다.');
            }
    
            const data = await response.json();
            
            // data 객체에서 duration 필드가 있는지 확인 후 설정
            if (data.duration !== undefined) {
                setDuration(data.duration.toFixed(1));
            } else {
                // duration 필드가 없을 경우 처리
                console.warn('서버 응답에 duration 필드가 없습니다.');
            }
    
            // 나머지 필드들 설정
            setSpeakerTexts(data.speaker_texts);
            setTextDownloadLinks(data.text_download_links);
            setFileName(data.org_filename);
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            setIsLoading(false); // 로딩 종료
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
        const download = await fetch('http://localhost:8000/api/download_txt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadData),
        });
    };


    return (
        <>
            <section className="image-section">
                <figure className="image-container">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/24c9bd176a5e8d8ca0b7b01d2704455bd5337f5d6c5180375bd3f24b58abf342?apiKey=9fb55b04424d4563a105428acb43ab19&"
                        alt="Description of the image"
                        className="main-image"
                    />
                </figure>
            </section>
            <section className="upload-section">
                <div className="upload-container">
                    <h1 className="upload-title">오디오 파일을 업로드해주세요.</h1>
                    <form className="upload-form" onSubmit={handleSubmit}>
                        {/* <button className="file-select-button" type="button">
                            파일 선택
                        </button> */}
                        <div className="file-info">
                            <label htmlFor="file-upload" className="visually-hidden">
                                파일을 선택해주세요.
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                className="file-upload"
                                aria-label="파일을 선택해주세요."
                                onChange={handleFileChange}
                            />
                        </div>
                        <button className="file-upload-button" type="submit" disabled={isLoading}>
                            {isLoading ? '로딩 중...' : '파일 업로드'}
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5bdc71e24f35d3498f1329292db22aa237d7c5aff0a858505015132b023b2d40?apiKey=9fb55b04424d4563a105428acb43ab19&"
                                alt=""
                                className="upload-icon"
                            />
                        </button>
                    </form>
                </div>
                </section>
                {/* 화자 분리 결과 및 다운로드 링크 표시 */}
                {speakerTexts && (
                    <section className="results-container">
                        <div className="results-header">화자 분리 결과</div>
                        <div className="results-bullet">•</div>
                        <div className="results-bullet dimmed">•</div>
                        <div className="results-bullet highlight">•</div>
                        <div className="results-duration">소요 시간: {duration}초</div>
                        <form className='results-container2'>
                            <div className="speaker-results">
                                {Object.entries(speakerTexts).map(([speakerId, texts]) => (
                                    <form className="speaker" key={speakerId}>
                                        <div className="speaker-header">
                                            <div className="div-9">
                                                <div className="speaker-id">SPEAKER {speakerId}</div>
                                                <img
                                                    loading="lazy"
                                                    src={`https://cdn.builder.io/api/v1/image/assets/TEMP/c8721954f6fdea1ecb1c144ac2e72c27ac31bb67260fa3cd2358f3686425e23a?apiKey=9fb55b04424d4563a105428acb43ab19&`}
                                                    alt="speaker"
                                                />
                                                </div>
                                        </div>
                                        <div className="speaker-divider"></div>
                                        <div className="speaker-text">
                                            {texts.map((text, index) => (
                                                // <div key={`bullet-${index}`}>
                                                    <li key={index}>{text}</li>
                                                    // <div className="bullet">•</div>
                                                    // <div className="text">{text}</div>
                                                // </div>
                                            ))}
                                        </div>
                                        {textDownloadLinks && textDownloadLinks[speakerId] && (
                                        <button className="txt-download-button" onClick={() => downloadFile(speakerId)}>SPEAKER {speakerId}.txt</button>)}

                                    </form>
                                    
                                
                            )
                            )}
                            </div>
                        </form>
                    </section>
                )}
            
        </>

    );
};

  
export default App2;