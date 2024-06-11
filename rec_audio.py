# 적용되어야 할 파일.
import speech_recognition as sr  # pip install SpeechRecognition
from gtts import gTTS
import os
import playsound
import time
from datetime import datetime

import wave

class VoiceRecorder:
    def __init__(self, device_index=1):
        self.mic = sr.Microphone(device_index=device_index)
        self.recd = False
        self.frames = []

    def speak(self, text):
        tts = gTTS(text=text, lang='ko')
        filename = 'voice.mp3'
        tts.save(filename)  # 안내 방송해줄 음성 파일 생성.
        playsound.playsound(filename)  # 위에서 생성한 음성 파일을 실행.
        os.remove(filename)  # 파일 제거

    def record_audio(self):
        print("음성녹음을 시작합니다.")
        self.recd = True

    def save_audio(self, filename='make.wav'):
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(1)  # 단일 채널
            wf.setsampwidth(2)  # 16-bit 샘플링
            wf.setframerate(44100)  # 44.1kHz 샘플링 속도 (일반적인 CD 품질)
            wf.writeframes(b''.join(self.frames))

    def get_audio(self):
        excute = True
        while excute:
            r = sr.Recognizer()
            with self.mic as source:
                print("말씀하세요")
                audio = r.listen(source, timeout=5, phrase_time_limit=5)
                said = " "

                try:
                    said = r.recognize_google(audio, language='ko-KR')
                    print("말씀하신 내용입니다 : ", said)
                    if self.recd:
                        self.frames.append(audio.get_wav_data())
                    if '레코딩' in said:
                        self.record_audio()

                    if '종료' in said:
                        print('음성녹음을 종료합니다.')
                        self.save_audio()
                        excute = False

                except Exception as e:
                    print("Exception: " + str(e))

        return said