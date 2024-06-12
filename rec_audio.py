# 적용되어야 할 파일.
import speech_recognition as sr  # pip install SpeechRecognition
from gtts import gTTS
import playsound
import wave
import time
import os
from realTime_rec import RealTimeRec

class VoiceRecorder:
    
    # 생성자
    def __init__(self, device_index=1):
        self.mic       = sr.Microphone(device_index=device_index)
        self.recd      = False
        self.allFrames = []
        self.frames    = []
        self.rtrcd     = None
        self.rcd_start = None
        self.rcd_end   = None                

    def speak(self, text):
        tts = gTTS(text=text, lang='ko')
        filename = 'voice.mp3'
        tts.save(filename)                              # 안내 방송해줄 음성 파일 생성.
        playsound.playsound(filename)                   # 위에서 생성한 음성 파일을 실행.
        os.remove(filename)                             # 파일 제거

    def record_audio(self):
        print("AI : 음성녹음을 시작합니다.")
        self.recd = True
        self.rcd_start = time.time()
        self.rtrcd = RealTimeRec(device_index=1)
        self.rtrcd.start()  # 녹음 스레드 시작

    def save_audio(self, filename='voice_record.wav'):
        print('녹음종료')
        self.rtrcd.stop()  # 녹음 스레드 중지
        print('stop')
        self.rtrcd.join()  # 녹음 스레드 종료를 기다림
        print('join')
        self.allFrames.append(self.rtrcd.queue.get().get_wav_data())
        print('get_wav_data')
        with wave.open(filename, 'wb') as wf:                               # 'wb'는 바이너리 쓰기 모드로 열라는 뜻. 
            wf.setnchannels(1)                                              # 단일 채널
            wf.setsampwidth(2)                                              # 16-bit 샘플링
            wf.setframerate(44100)                                          # 44.1kHz 샘플링 속도 (일반적인 CD 품질)
            wf.writeframes(b''.join(self.allFrames))                        # wf.writeframes(b''.join(self.frames))

    def get_audio(self):
        
        excute = True
        while excute:
            
            r  = sr.Recognizer()                                            # 콘솔에 출력할 텍스트를 보여주기 위한 레코드
            with self.mic as source:
                
                print("말씀하세요")
                print(1)
                audio   = r.listen(source, timeout=5, phrase_time_limit=5)
                print(2)
                said    = " "
                print(3)
                try:
                    print(4)
                    said = r.recognize_google(audio, language='ko-KR')
                    print(5)
                    print("말씀하신 내용입니다 : ", said)
                    if self.recd:
                        self.frames.append(audio.get_wav_data())
                    
                    if '녹음' in said and not self.recd:
                        self.record_audio()

                    if '종료' in said and self.recd:
                        print('음성녹음을 종료합니다.')
                        self.save_audio()
                        excute = False                                          #while문 종료.
                        self.rcd_end = time.time() - self.rcd_start
                        print("recording time :", self.rcd_end)                 #콘솔에 녹음시간 출력.

                except sr.UnknownValueError:
                    print("말씀하신 내용을 이해하지 못했습니다.")
                except sr.RequestError as e:
                    print("구글 API 요청 중 오류가 발생했습니다; {0}".format(e))
                except Exception as e:
                    print("예상치 못한 오류가 발생했습니다: " + str(e))

        return said