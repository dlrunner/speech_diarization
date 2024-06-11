# 3. 분할된 오디오 파일에서 transcript를 작성(오디오 -> 텍스트 변환)
import speech_recognition as sr
import time
r = sr.Recognizer()
start = time.time()
# with sr.AudioFile('SPEAKER_011111.wav') as source:   
#     audio = r.listen(source)
#     text = r.recognize_google(audio, language='ko')
#     print(text)

with sr.AudioFile('file_segments\SPEAKER_011111.wav') as source:   
    audio = r.listen(source)
    text = r.recognize_google(audio, language='ko')
    print(text)

print("time :", time.time() - start)