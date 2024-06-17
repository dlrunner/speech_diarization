import React, { useState, useEffect } from "react";
import "./Accordion.css"; // 스타일링을 위한 CSS 파일

const Accordion = ({ id, texts, txtDownload, wavDownload, files , selectedIds, setSelectedIds }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [checkSpeaker, setCheckSpeaker] = useState(false);
  const [speakerIds, setSpeakerIds] = useState([]);

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
          onChange={onChange}         // onChange 이벤트 핸들러에 직접 전달
        />
        {children}
      </label>
    );
  }

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setCheckSpeaker(isChecked); // 체크박스 상태를 업데이트
    setSelectedIds((prevSelectedIds) => {
        if (isChecked) {
            // 체크박스가 선택된 경우 해당 스피커 아이디를 리스트에 추가하여 반환
            return [...prevSelectedIds, id];
        } else {
            // 체크박스가 해제된 경우 해당 스피커 아이디를 리스트에서 제거하여 반환
            return prevSelectedIds.filter((selectedId) => selectedId !== id);
        }
    });
  };

  // useEffect를 사용하여 selectedIds 상태가 변경될 때마다 실행되는 로그 출력
  useEffect(() => {
    // console.log("selectedIds:", selectedIds);
  }, [selectedIds]);

  return (
    <>
      <div className="accordion">
        <div className="accordion-header" onClick={toggleAccordion}>
          <Checkbox
            checked={checkSpeaker}                            //checkSpeaker 상태를 checked 속성으로 전달
            onChange={(event) => handleCheckboxChange(event)} //handleCheckboxChange 함수를 onChange로 설정
          >
          </Checkbox>
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
                <FileCard
                    key={index}
                    imgSrc={file.imgSrc}
                    alt={file.alt}
                    text={file.text}
                    onClick={(event) => {
                      if (index === 0) {
                          txtDownload(event, id); //1.텍스트 다운로드 함수 호출
                      } else if (index === 1) {
                          wavDownload(event, id); //2.영상 다운로드 함수 호출
                      }
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Accordion;
