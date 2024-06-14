import speech_recognition as sr 
import pyaudio
import wave
import os
from gtts import gTTS
import playsound
import threading

class VoiceRecognizer:

    def __init__(self, device_index=1, chunk_size=1024, channels=1, rate=44100, format=pyaudio.paInt16):
        self.device_index = device_index
        self.chunk_size = chunk_size
        self.channels = channels
        self.rate = rate
        self.format = format
        self.frames = []
        self.recording = False

    def speak(self, text):
        tts = gTTS(text=text, lang='ko')
        filename = 'announcement.mp3'
        tts.save(filename)
        playsound.playsound(filename)
        os.remove(filename)

    def record_audio(self):
        self.speak("음성 녹음을 시작합니다.")
        self.recording = True
        self.frames = []
        self.thread = threading.Thread(target=self._record)
        self.thread.start()

    def _record(self):
        p = pyaudio.PyAudio()
        stream = p.open(format=self.format,
                        channels=self.channels,
                        rate=self.rate,
                        input=True,
                        frames_per_buffer=self.chunk_size,
                        input_device_index=self.device_index)

        while self.recording:
            data = stream.read(self.chunk_size)
            self.frames.append(data)

        stream.stop_stream()
        stream.close()
        p.terminate()

    def stop_recording(self):
        #self.speak("녹음을 종료합니다.")
        print("녹음을 종료합니다.")
        self.recording = False
        self.thread.join()
        self.save_audio()

    def save_audio(self, filename='recordOutput.wav'):
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(self.channels)
            wf.setsampwidth(pyaudio.PyAudio().get_sample_size(self.format))
            wf.setframerate(self.rate)
            wf.writeframes(b''.join(self.frames))

    def get_audio(self):
        print("프로그램을 시작합니다.")
        all_said = []
        execute = True
        recognizer = sr.Recognizer()
        while execute:
            print("말씀하세요.")
            with sr.Microphone(device_index=self.device_index) as source:
                audio = recognizer.listen(source, timeout=1, phrase_time_limit=10)
                try:
                    said = recognizer.recognize_google(audio, language='ko-KR')
                    all_said.append(said)
                    print("음성 내용 출력:", said)

                    if '녹음' in said and not self.recording:
                        self.record_audio()

                    if '종료' in said and self.recording:
                        self.stop_recording()
                        execute = False

                except sr.UnknownValueError:
                    print("말씀하신 내용을 이해하지 못했습니다.")
                except sr.RequestError as e:
                    print(f"구글 API 요청 중 오류가 발생했습니다: {e}")
                except Exception as e:
                    print(f"예상치 못한 오류가 발생했습니다: {e}")

        return ' '.join(all_said)               

#if __name__ == "__main__":
    #recorder = VoiceRecorder()
    #recorder.get_audio()