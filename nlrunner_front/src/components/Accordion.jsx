import React, { useState } from "react";
import "./Accordion.css"; // 스타일링을 위한 CSS 파일

const Accordion = ({ id, txtDownload, wavDownload }) => {
  // console.log("id" + id);

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="accordion">
        <div className="accordion-header" onClick={toggleAccordion}>
          <h3>123</h3>
          <span className={isOpen ? "open" : ""}>{isOpen ? "▽" : "▽"}</span>
        </div>
        {isOpen && (
          <div className="accordion-content">
            {Object.entries(id).map((text, index) => (
              <li key={index}>{text}</li>
            ))}
            <button className="txt-download-button" onClick={(event) => txtDownload(event, id)}>SPEAKER {id}.txt</button>
            <button className="wav-download-button" onClick={(event) => wavDownload(event, id)}>SPEAKER {id}.wav</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Accordion;
