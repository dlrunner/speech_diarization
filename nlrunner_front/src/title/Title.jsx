import "./Title.css";
import mainImage from "./Intersect.png";
const Title = ({ className = "" }) => {
  return (
    <section className={`title ${className}`}>
      <div className="intersect-parent">
        <img
          className="intersect-icon"
          loading="lazy"
          alt=""
          src={mainImage}
/>
        <div className="frame-child" />
      </div>
      <div className="title-text">
        <h1 className="ai">{`AI 오디오 자동 필터 `}</h1>
        <div className="div">
            <p className="p">손쉽게 오디오에서 화자 분리를 하고,</p>
            <p className="p1">{`화자별 음성 파일 추출 및 스크립트 제공 서비스 `}</p>
        </div>
      </div>
    </section>
  );
};

export default Title;