import speech_recognition as sr             #pip install SpeechRecognition
from gtts import gTTS
import os
import playsound
import time
from datetime import datetime

# 음성을 입력할 마이크 생성.
mic = sr.Microphone(device_index = 1)

#안내 음성 출력을 위한 메소드
def speak(text):
    tts = gTTS(text=text, lang='ko')
    filename='voice.mp3'
    tts.save(filename)                  #안내 방송해줄 음성 파일 생성.
    playsound.playsound(filename)       #위에서 생성한 음성 파일을 실행.
    os.remove(filename)                 #해당 부분이 없으면, 퍼미션 에러 발생. 이후에 파일 생성 시 문제가 되는 듯.

def get_audio():
    r = sr.Recognizer()
   #with sr.Microphone(1) as source:    원본 소스는 sr의 Microphone을 사용했으나, 내 이어폰 사용을 위해 코드 변경.
    with mic as source:
        print("말씀하세요")
       #audio = r.listen(source)
        audio = r.listen(source, timeout = 5, phrase_time_limit = 5)
        said = " "    

        try:
            said = r.recognize_google(audio, language='ko-KR')
            print("말씀하신 내용입니다 : ", said)
        except Exception as e:
            print("Exception :" + str(e))    

    return said    

#1. 안내 방송 음성 출력
speak("안녕하세요. 2초 후에 '말씀하세요' 라는 문장이 화면에 출력된 후 말씀하시면 해당 내용이 텍스트로 저장 됩니다.")

# 2. 음성입력(메소드 호출)
text=get_audio()

# 5.음성 파일을 텍스트로 변환하여 파일로 저장
with open('memo.text', 'w', encoding='utf-8') as f:
    f.write(str(text)+"\n")