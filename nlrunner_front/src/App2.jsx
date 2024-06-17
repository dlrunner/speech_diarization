import React, { useState, useRef } from 'react';
import logo from './logo.svg';
import './App2.css';
import RecordingComponent from './RecordingComponent.jsx'; // 녹음 컴포넌트 임포트
import Header from './layout/header';
import Footer from './layout/footer';
import Loader from './components/Loader';
import Accordion from "./components/Accordion.jsx";
import Title from "./title/Title.jsx";


//텍스트, 비디오 전체 버튼관련 function
function FileCard({ imgSrc, alt, text, onClick }) {
    return (
        <section className="file-card">
            <button className="file-download-button" onClick={onClick}>
                <img loading="lazy" src={imgSrc} alt={alt} className="file-image" />
                <div className="file-description">{text}</div>
            </button>
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
    const [checkSpeaker, setCheckSpeaker] = useState(false);
    const fileInputRef = useRef(null);
    const [size, setSize] = useState(12);
    const [selectedIds, setSelectedIds] = useState([]); // App2.jsx 파일 내부에 추가

    const files = [
        { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/8acf0177735b9653421f3b8d7f5f65d5e522bd6a5c732e3cb2963265a66fa00b?apiKey=9fb55b04424d4563a105428acb43ab19&", alt: "텍스트 파일 이미지", text: "텍스트 파일" },
        { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/8acf0177735b9653421f3b8d7f5f65d5e522bd6a5c732e3cb2963265a66fa00b?apiKey=9fb55b04424d4563a105428acb43ab19&", alt: "오디오 파일 이미지", text: "오디오 파일" },
    ];

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file.name);
            setFile(file); // 파일 선택 시 상태 업데이트
            setFileName(file.name); // 파일 이름 설정
        }
    };

    const handleDownloadAllTxt = async (event, index) => {
        
        event.preventDefault();
        if (selectedIds.length === 0) {
            
            alert("다운로드할 데이터를 선택하세요.");
            return; // 데이터가 없으면 함수를 종료합니다.
        }

        try {
            
            const requestData = {
                  selectedIds: selectedIds // 혹은 다른 변수에 저장된 데이터를 사용할 수 있음
                , filename : fileName
            };
            
            let apiUrl = '';
            if (index === 0) {
                apiUrl = '/api/download_all_txt/';
            } else {
                apiUrl = '/api/download_all_wav/';
            }
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
                  //필요한 데이터가 있다면 body에 추가
                , body: JSON.stringify(requestData) //데이터를 JSON 문자열로 변환하여 전달
            });
    
            if (!response.ok) {
                throw new Error('압축 파일을 다운로드하는 동안 오류가 발생했습니다.');
            }
    
            // 응답에서 blob 데이터를 가져옴
            const blob = await response.blob();
    
            // Blob 데이터를 URL로 변환하여 링크 생성
            const url = window.URL.createObjectURL(blob);
    
            // 링크 생성 및 다운로드
            const a = document.createElement('a');
            a.href = url;
            a.download = 'downloaded_files.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error:', error);
            // 오류 처리
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
            <Title />

            <section className="upload-section">
                <div className="upload-container">
                    <h1 className="upload-title">{isLoading ? '오디오 필터링 중 기다려주세요!' : '오디오 파일을 업로드 해주세요'}</h1>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <form className="upload-form" onSubmit={handleSubmit}>
                            <button
                                type="button"
                                className="file-select-button"
                                onClick={() => fileInputRef.current.click()}
                            >
                                파일 선택
                            </button>
                            <div className="file-info">
                                <label htmlFor="file-upload" className="visually-hidden"></label>
                                <input
                                    type="file"
                                    id="file-upload"
                                    ref={fileInputRef} // 참조를 추가합니다.
                                    className="file-upload"
                                    aria-label="파일을 선택해주세요."
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }} // 입력 필드를 숨깁니다.
                                />
                                <input
                                    type="text"
                                    readOnly
                                    value={fileName || ''}
                                    className="file-name-display"
                                    placeholder="선택된 파일이 없습니다"
                                />
                            </div>
                            <button className="file-upload-button" type="submit" disabled={isLoading}>
                                {isLoading ? '로딩 중...' : '파일 업로드'}
                                <img
                                    loading="lazy"
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5bdc71e24f35d3498f1329292db22aa237d7c5aff0a858505015132b023b2d40?apiKey=9fb55b04424d4563a105428acb43ab19&"
                                    alt="업로드 아이콘"
                                    className="upload-icon"
                                />
                            </button>
                        </form>
                    )}
                </div>
            </section>
            {/* 화자 분리 결과 및 다운로드 링크 표시 */}
            {speakerTexts && !isLoading && (
                <section className="results-container">
                    <div className="results-header">화자 분리 결과</div>
                    <div className="results-bullet blink">•</div>
                    <div className="results-bullet dimmed">•</div>
                    <div className="results-bullet highlight">•</div>
                    <div className="results-duration">소요 시간: {duration}초</div>
                    <form className="container">
                        <div className="files-wrapper">
                            {files.map((file, index) => (
                                <FileCard 
                                    key={index}
                                    imgSrc={file.imgSrc}
                                    alt={file.alt}
                                    text={file.text}
                                    onClick={(event) => handleDownloadAllTxt(event, index)} // index를 전달합니다.
                                />
                            ))}
                        </div>
                    </form>

                    <div className='accordians'>
                        {Object.keys(speakerTexts).map((speakerId) => (
                        <Accordion
                            key={speakerId}
                            id={speakerId}
                            texts={speakerTexts}
                            txtDownload={txtDownload}
                            wavDownload={wavDownload}
                            files={files}
                            selectedIds={selectedIds} // 수정된 부분
                            setSelectedIds={setSelectedIds} // 수정된 부분
                        />
                        ))}
                    </div>
                </section>
            )}
            <Footer />
        </>
    );
};

export default App2;
