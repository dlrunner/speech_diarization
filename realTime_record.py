# 적용되어야 할 파일.
import speech_recognition as sr  # pip install SpeechRecognition
import threading
from queue import Queue

class RealTimeRecord(threading.Thread):

    # 생성자
    def __init__(self, device_index=1):
        super().__init__()
        self.mic        = sr.Microphone(device_index)
        self.queue      = Queue()                                    # 데이터를 전달하기 위한 큐
        self.stop_event = threading.Event()                         # 스레드를 중지하기 위한 이벤트                             # 녹음 시작 후, 전체 음성을 녹음한 파일을 생성하기 위한 필드.
    
    def run(self):
        with self.mic as source:
            while not self.stop_event.is_set():
                audio = self.recognize(source)
                self.queue.put(audio)

    def stop(self):
        print("녹음 ...")
        self.stop_event.set()

    def recognize(self, source):
        recognizer = sr.Recognizer()
        recognizer.dynamic_energy_threshold = False
        recognizer.energy_threshold = 4000
        try:
            print("녹음 진행...")
            return recognizer.listen(source, timeout=None)
        except Exception as e:
            print("오디오 데이터를 인식하는 동안 오류가 발생했습니다:", e)
            return None