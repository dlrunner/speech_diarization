import speech_recognition as sr
from queue import Queue
import threading

class RealTimeRecord(threading.Thread):

    # 생성자
    def __init__(self, device_index=1):
        super().__init__()
        self.mic        = sr.Microphone(device_index)
        self.queue      = Queue()                                           # 데이터를 전달하기 위한 큐
        self.stop_event = threading.Event()                                 # 스레드를 중지하기 위한 이벤트                             # 녹음 시작 후, 전체 음성을 녹음한 파일을 생성하기 위한 필드.
        self.count      = 0
    def run(self):
        with self.mic as source:
            #self.stop_event.is_set() 이게 처리되기 전까지는 while을 탄다.
            while not self.stop_event.is_set():
                self.count = self.count+1
                print("self.count :" , self.count)
                audio = self.recognize(source)
                if audio is not None:
                    self.queue.put(audio)

    def stop(self):
        print("실시간 녹음 중지 시작...")
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