import React, { useState } from "react";
import "./Accordion.css"; // 스타일링을 위한 CSS 파일

const Accordion = ({ id, txtDownload, wavDownload }) => {
  // console.log("id" + id);

  const [isOpen, setIsOpen] = useState(false);
  const [checkSpeaker, setCheckSpeaker] = React.useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  function FileCard({ imgSrc, alt, text }) {
    return (
      <section className="file-card">
        <img loading="lazy" src={imgSrc} alt={alt} className="file-image" />
        <div className="file-description">{text}</div>
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
          <h3>123</h3>
          <span className={isOpen ? "open" : ""}>{isOpen ? "▽" : "▽"}</span>
        </div>
        {isOpen && (
          <div className="accordion-content">
            {Object.entries(id).map((text, index) => (
              <li key={index}>{text}</li>
            ))}
            <button
              className="txt-download-button"
              onClick={(event) => txtDownload(event, id)}
            >
              SPEAKER {id}.txt
            </button>
            <button
              className="wav-download-button"
              onClick={(event) => wavDownload(event, id)}
            >
              {" "}
              SPEAKER {id}.wav{" "}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Accordion;
