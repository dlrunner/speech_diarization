import React, { useState } from 'react';
import './App2.css';



function MyComponent() {
    // 상태 정의
    const [file, setFile] = useState(null);
    const [speakerTexts, setSpeakerTexts] = useState(null);
    const [textDownloadLinks, setTextDownloadLinks] = useState(null);
    const [duration, setDuration] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState(null);

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

    const downloadFile = async (fileLink, speakerId) => {
        try {
            const response = await fetch(fileLink);
            const text = await response.text();
            const blob = new Blob([text], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${speakerId}_transcript.txt`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error:', error);
            alert('파일 다운로드 중 오류가 발생했습니다.');
        }
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
              <button className="file-select-button" type="button">
                파일 선택
              </button>
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
        {/* 화자 분리 결과 및 다운로드 링크 표시 */}
        {speakerTexts && (
          <div className="results-container">
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
          <div className="download-container">
            <h2>다운로드 가능한 TXT 파일</h2>
            <ul>
              {Object.entries(textDownloadLinks).map(([speakerId, fileLink]) => (
                <li key={speakerId}>
                  Speaker {speakerId}: <button onClick={() => downloadFile(fileLink, speakerId)}>다운로드 TXT 파일</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        </section>
      </>
    );
  }
  
export default MyComponent;