import React, { useState } from "react";
import "./Accordion.css"; // 스타일링을 위한 CSS 파일

const Accordion = ({ id, texts, txtDownload, wavDownload,files }) => {
  // console.log("id" + id);

  const [isOpen, setIsOpen] = useState(false);
  const [checkSpeaker, setCheckSpeaker] = React.useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  //55 line에서 호출 됨. 
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
  function Checkbox({ children, disabled, checked, onChange }) {
    return (
      <label>
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={({ target: { checked } }) => onChange(checked)}
        />
        {children}
      </label>
    );
  }

  return (
    <>
      <div className="accordion">
        <div className="accordion-header" onClick={toggleAccordion}>
          <Checkbox checked={checkSpeaker} onChange={setCheckSpeaker} />
          <h3>SPEAKER {id}</h3>
          <span className={isOpen ? "open" : ""}>{isOpen ? "▼" : "▼"}</span>
        </div>
        {isOpen && (
          <div className="accordion-content">
            {texts[id].map((text, index) => (
              <li key={index}>{text}</li>
            ))}
            {/* <div className="download-buttons-2"> */}
            <div className="files-wrapper-2">
                            {files.map((file, index) => (
                                <FileCard key={index} 
                                          imgSrc={file.imgSrc} 
                                          alt={file.alt} 
                                          text={file.text} 
                                          onClick={(event) => txtDownload(event, id)}
                                          />
                            ))}

              {/* <button
                className="txt-download-button"
                onClick={(event) => txtDownload(event, id)}
              >
                SPEAKER {id}.txt
              </button>
              <button
                className="wav-download-button"
                onClick={(event) => wavDownload(event, id)}
              >
                SPEAKER {id}.wav
              </button> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Accordion;
