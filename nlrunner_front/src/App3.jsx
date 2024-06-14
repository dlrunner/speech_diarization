import React from 'react'
import Accordion from './components/Accordion';

const App3 = () => {
  return (
    <div>
      <Accordion
        title="Section 1"
        content="This is the content of section 1."
      />
      <Accordion
        title="Section 2"
        content="This is the content of section 2."
      />
      <Accordion
        title="Section 3"
        content="This is the content of section 3."
      />
    </div>
  )
}

export default App3