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