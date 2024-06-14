import React, { useState, useRef } from 'react';
import logo from './logo.svg';
import './App2.css';
import RecordingComponent from './RecordingComponent.jsx'; // 녹음 컴포넌트 임포트
import Header from './layout/header';
import Footer from './layout/footer';
function FileCard({ imgSrc, alt, text }) {
    return (
      <section className="file-card">
        <img loading="lazy" src={imgSrc} alt={alt} className="file-image" />
        <div className="file-description">{text}</div>
      </section>
    );
  }
  
const App2 = () => {
    const [file, setFile] = useState(null);
    const [speakerTexts, setSpeakerTexts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(null); // 소요시간 표시용
    const [fileName, setFileName] = useState(null);
    const [message, setMessage] = useState('');
    const files = [
        { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/8acf0177735b9653421f3b8d7f5f65d5e522bd6a5c732e3cb2963265a66fa00b?apiKey=9fb55b04424d4563a105428acb43ab19&", alt: "텍스트 파일 이미지", text: "텍스트 파일" },
        { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/8acf0177735b9653421f3b8d7f5f65d5e522bd6a5c732e3cb2963265a66fa00b?apiKey=9fb55b04424d4563a105428acb43ab19&", alt: "오디오 파일 이미지", text: "오디오 파일" },
      ];
    
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
            const response = await fetch('/api/uploadfile/', {
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

    const txtDownload = async (event, speakerId) => {
        event.preventDefault();
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

    const wavDownload = async (event, speakerId) => {
        event.preventDefault();
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
        <>
            <Header /> {/* Header 추가 */}
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
                    <button className="file-select-button">파일 선택</button>

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
                        <form className="container">
                            <div className="files-wrapper">
                            {files.map((file, index) => (
                                <FileCard key={index} imgSrc={file.imgSrc} alt={file.alt} text={file.text} />
                            ))}
                            </div>
                        </form>

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
                                        <button className="txt-download-button" onClick={(event) => txtDownload(event, speakerId)}>SPEAKER {speakerId}.txt</button>
                                        <button className="wav-download-button" onClick={(event) => wavDownload(event, speakerId)}>SPEAKER {speakerId}.wav</button>
                                    </form>                                                              
                                )
                            )}
                            </div>
                        </form>
                    </section>
                )}
            <Footer /> 
        </>

    );
};

export default App2;
