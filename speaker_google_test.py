import speech_recognition as sr
import time
import os

# Recognizer 초기화
r = sr.Recognizer()
start = time.time()

# 세그먼트 파일 경로 설정
seg_keyword = "speech2" # 파일명 변수로 받음
seg_filepath = "file_segments\\" + seg_keyword + "_segments"    # 잘려진 음성파일이 저장된 경로 지정

# 화자별 텍스트 저장을 위한 딕셔너리 초기화
speaker_texts = {}

# 세그먼트 파일 목록 가져오기
file_list = [f for f in os.listdir(seg_filepath) if f.endswith(".wav")]

# 파일 이름에서 nnnn 부분 추출 및 정렬 -> nnnn은 음성파일에서 화자 존재하기 시작한 시간(분,초)
file_list.sort(key=lambda x: int(x.split('_')[2].split('.')[0]))    # 시간 순서대로 정렬

# 각 파일에 대해 음성 인식 수행
for file_name in file_list:
    # 화자 ID 추출 (예: "SPEAKER_00_31.wav"에서 00 추출)
    speaker_id = file_name.split('_')[1]
    
    # 화자 ID에 해당하는 텍스트 리스트가 없으면 초기화
    if speaker_id not in speaker_texts:
        speaker_texts[speaker_id] = []
    
    # 오디오 파일 경로 설정
    file_path = os.path.join(seg_filepath, file_name)
    
    # 오디오 파일을 읽고 음성 인식 수행
    with sr.AudioFile(file_path) as source:
        audio = r.listen(source)
        try:
            text = r.recognize_google(audio, language='ko')
            speaker_texts[speaker_id].append(text)
            print(f"화자 {speaker_id}: {text}")
        except sr.UnknownValueError:
            print(f"화자 {speaker_id}: 인식 불가")
        except sr.RequestError as e:
            print(f"화자 {speaker_id}: 요청 오류 {e}")
        print("----" * 10)

# 화자별 텍스트 출력
for speaker_id, texts in speaker_texts.items():
    print(f"화자 {speaker_id}의 전체 텍스트:")
    for text in texts:
        print(text)
    print("====" * 10)

print("총 소요 시간:", time.time() - start)