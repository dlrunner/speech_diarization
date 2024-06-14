import React from "react";
import Accordion from "./Accordion";

const AccordionContainer = ({ speakerTexts }) => {
  console.log(speakerTexts);

  return (
    <>
      <div>
        {speakerTexts.map((speakerId, texts) => (
          <Accordion key={speakerId} id={speakerId} texts={texts} />
        ))}
      </div>
    </>
  );
};

export default AccordionContainer;
