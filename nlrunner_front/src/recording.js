// export const startRecording = (setRecordingStatus, setRecordedText) => {
//     fetch('http://127.0.0.1:8000/recording', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({}),
//     })
//     .then(response => response.json()) // JSON 형식으로 응답을 파싱합니다.
//     .then(data => {
//       // 서버에서 받은 데이터를 상태(state)에 저장합니다.
//       setRecordingStatus("상태 : " + data.status);
//       setRecordedText("음성내용 : " + data.text);
//     })
//     .catch(error => {
//       // 오류가 발생한 경우 처리합니다.
//       console.error('Error starting recording:', error);
//     });
//   };
export const startRecording = async (setRecordingStatus, setRecordedText, canvasRef) => {
    try {
        debugger;
      setRecordingStatus("녹음 중...");
      try {
    
                    const response = await fetch('http://127.0.0.1:8000/api/recording/', {
                    method: 'POST',
                    // body: formData
                  });
                  const data = await response.json();
                  setRecordingStatus("상태 : " + data.status);
                  setRecordedText("음성내용 : " + data.text);
                } catch (error) {
                  console.error('Error sending audio to server:', error);
                  setRecordingStatus("녹음 실패");
                }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
  
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
  
    //   mediaRecorder.onstop = async () => {
    //     const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    //     const formData = new FormData();
    //     formData.append('file', audioBlob);
  
        
    //   };
  
      mediaRecorder.start();
  
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext("2d");
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
  
      const draw = () => {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
  
        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  
        canvasCtx.beginPath();
        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;
  
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * canvas.height / 2;
  
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
  
          x += sliceWidth;
        }
  
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      };
  
      draw();
  
      return () => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingStatus("녹음 실패");
    }
  };