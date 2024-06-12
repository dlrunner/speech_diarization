from fastapi import FastAPI, File, UploadFile
from pyannote.audio import Pipeline
import time
import io
from pydub import AudioSegment
import os
import speech_recognition as sr
import joblib

pipeline = Pipeline.from_pretrained(
  "pyannote/speaker-diarization-3.1",
  use_auth_token="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")

silence_duration = 1000
some_silence = AudioSegment.silent(duration=silence_duration) 

r = sr.Recognizer()

app = FastAPI()
@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    
    start = time.time()
    
    user = 'user001' # 유저 이름
    org_filename = user + '_' + str(round(time.time())) # 유저 이름에 타임스탬프 추가
    # org_filepath = "source\\" + org_filename  # 변수에 담은 파일명에 경로추가 -> 경로/파일명
    output_folder = "file_segments\\" + org_filename + "_segments\\"    # 잘라낸 음성파일 새로 저장할 경로 -> file_segments/파일명_segments/
    seg_filepath = "file_segments\\" + org_filename + "_segments"    # 잘려진 음성파일이 저장된 경로 지정
    rttm_dirs = "rttm_dirs" # rttm 파일 저장할 새 디렉터리
    speaker_dirs = "speaker_dirs" # rttm 파일 저장할 새 디렉터리

    byte_file = await file.read()
    audio = io.BytesIO(byte_file)
    diarization = pipeline(audio)

    if not os.path.exists(rttm_dirs):   # rttm 디렉터리 생성
        os.makedirs(rttm_dirs)

    if not os.path.exists(speaker_dirs):   # rttm 디렉터리 생성
        os.makedirs(speaker_dirs)

    # rttm_name =  org_filename + ".rttm"
    rttm_name = os.path.join(rttm_dirs, org_filename + ".rttm")
    with open(rttm_name, "w") as rttm: # rttm_dirs/파일명.rttm 저장
        diarization.write_rttm(rttm)

    for turn, _, speaker in diarization.itertracks(yield_label=True):
        print(str(turn.start) + " -- " + str(turn.end) + " -- " + str(turn.duration)+ " -- " + str(turn.overlaps))
    
    if not os.path.exists(output_folder):   # 잘라낸 음성파일 새로 저장할 경로로 폴더 생성
        os.makedirs(output_folder)

    with open(rttm_name) as f:
            lines = f.readlines()

    audio.seek(0)
    audio_segment = AudioSegment.from_file(audio, format="wav")

    for line in lines:
        line = line.replace('\r','').replace('\n','')
        line_arr = line.split(' ')

        #create variables we will need
        seg_start = int(line_arr[3].replace('.',''))
        seg_duration = int(line_arr[4].replace('.',''))
        seg_speaker = line_arr[7]
        seg_end = seg_start + seg_duration
        audio_segment_file_name = output_folder + seg_speaker + "_" + str(seg_start) + ".wav"

        audio2 = audio_segment[seg_start:seg_end]
        audio2.export(audio_segment_file_name, format="wav")

    speaker_texts = {}    # 화자별 텍스트 저장을 위한 딕셔너리 초기화
    file_list = [f for f in os.listdir(seg_filepath) if f.endswith(".wav")]    # 세그먼트 파일 목록 가져오기
    print(file_list)

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
        # for speaker_id, texts in speaker_texts.items():
        #     print(f"화자 {speaker_id}의 전체 텍스트:")
        #     for text in texts:
        #         print(text)
        #     print("====" * 10)
    speaker_dir_name = os.path.join(speaker_dirs, org_filename + "_dict.pickle")

    joblib.dump(speaker_texts, speaker_dir_name)
    print("time :", time.time() - start)
    return speaker_texts