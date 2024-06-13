import React from 'react';
import './App2.css';

function MyComponent() {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      // 추가적인 로직을 여기에 작성하세요.
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 파일 업로드 로직을 여기에 작성하세요.
    alert('파일이 업로드되었습니다!');
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
            <button className="file-upload-button" type="submit">
              파일 업로드
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
    </>
  );
}

export default MyComponent;