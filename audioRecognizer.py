# fastAPI로 http://127.0.0.1:8000/recording 호출 시 실행되는 파이썬 모듈
import speech_recognition as sr                             # 설치 명령어 : pip install SpeechRecognition
from realTime_record import RealTimeRecord
import threading
from gtts import gTTS
import playsound
import wave
import time
import os

class VoiceRecognizer:
    
    # VoiceRecognizer 클래스의 생성자
    def __init__(self, device_index=1):
        self.mic          = sr.Microphone(device_index)
        self.recordYn     = False
        self.frames       = []
        self.allFrames    = []
        self.recordThread = None
        self.recordStart  = None
        self.recordEnd    = None
        self.stop_event   = threading.Event()
        self.count        = 0                

    # 안내음성 생성 및 음성 출력.
    def speak(self, text):
        tts = gTTS(text=text, lang='ko')                    # gTTS는 Google Text-to-Speech 의 약어로, 구글에서 제공하며 텍스트를 음성으로 변환하는 모듈이다.
        filename = 'announcement.mp3'                       # speak 메소드 호출 시, 전달받은 텍스트 기반으로 announcement.mp3 음성 파일이 생성된다.
        tts.save(filename)                                  # 안내 방송해줄 음성 파일 생성.
        playsound.playsound(filename)                       # 위에서 생성한 음성 파일을 실행.
        os.remove(filename)                                 # 파일 제거(제거 하지 않으면 추후, 추가적으로 다른 파일 생성 시 오류발생하는 듯)

    # 음성 녹음 시작
    def record_audio(self):
        print("AI : 음성녹음을 시작합니다.")
        self.recordYn     = True
        self.recordStart  = time.time()
        self.recordThread = RealTimeRecord(device_index=1)  # 쓰레드 생성
        self.recordThread.start()                           # 녹음 스레드 시작

    def process_audio(self):
        print("음성 queue 데이터 저장")
        while not self.recordThread.queue.empty():
            print("queue is not empty")
            audio_data = self.recordThread.queue.get()
            if audio_data:
                self.allFrames.append(audio_data.get_wav_data())

    def save_audio(self, filename='recordOutput.wav'):
        
        print('1.쓰레드 종료 시작...')
        self.recordThread.stop()                            #녹음 스레드 중지
        self.recordThread.join()                            #녹음 스레드 종료를 기다림
        
        print('2.오디오 파일 데이터 저장')
        self.process_audio()
        
        print('3.오디오 파일 생성 시작')
        with wave.open(filename, 'wb') as wf:                               # 'wb'는 바이너리 쓰기 모드로 열라는 뜻. 
            wf.setnchannels(1)                                              # 단일 채널
            wf.setsampwidth(2)                                              # 16-bit 샘플링
            wf.setframerate(44100)                                          # 44.1kHz 샘플링 속도 (일반적인 CD 품질)
            wf.writeframes(b''.join(self.allFrames))                        # wf.writeframes(b''.join(self.frames))
            print('4.오디오 파일로 저장완료')

    def stop(self):
            print("녹음 중지...")
            self.stop_event.set()
            if self.recordThread is not None:
                self.recordThread.stop()  # assuming your RealTimeRecord class has a stop method
                self.recordThread.join()
            self.recordYn = False
    
    def get_audio(self):
        
        print("AI를 이용한 음성 녹음 프로그램을 시작합니다.")
        excute = True
        while excute:
            
            print("--- while count : ", self.count)
            forPrtRz  = sr.Recognizer()                                                 # cmd에 출력할 텍스트를 보여주기 위한 레코드
            with self.mic as source:
                
                # timeout           : 음성 처리 전 대기 시간                             : 1초
                # phrase_time_limit : 음성 처리 시간(사용자의 음성을 마이크 처리하는 term) : 5초
                inputAudio = forPrtRz.listen(source, timeout=2, phrase_time_limit=5)                                                        
                self.frames.append(inputAudio.get_wav_data())
                said       = " "                                                        #초기화인 듯.
                try:

                    said = forPrtRz.recognize_google(inputAudio, language='ko-KR')
                    print("마이크로 입력 된 음성 내용 화면에 출력: ", said)
                    
                    # 음성 내용 중 '녹음'이 있고, 객체의 recd 값이 False 일때.
                    if '녹음' in said and not self.recordYn:
                        self.record_audio()

                    # 음성 내용 중 '종료'이 있고, 객체의 recd 값이 True 일때.
                    if '종료' in said and self.recordYn:
                        self.save_audio()
                        self.recordEnd = time.time() - self.recordStart
                        print("recording time :", self.recordEnd)                 #콘솔에 녹음시간 출력.
                        print('쓰레드 종료')
                        self.stop()
                        excute = False                                            #while문 종료.

                except sr.UnknownValueError:
                    print("말씀하신 내용을 이해하지 못했습니다.")
                except sr.RequestError as e:
                    print("구글 API 요청 중 오류가 발생했습니다; {0}".format(e))
                except Exception as e:
                    print("예상치 못한 오류가 발생했습니다: " + str(e))

        return said