from fastapi import APIRouter, File, UploadFile
from pyannote.audio import Pipeline
import time
import io
from pydub import AudioSegment
import os
import speech_recognition as sr
import joblib
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from text_download import TextDownlaod

pipeline = Pipeline.from_pretrained(
  "pyannote/speaker-diarization-3.1",
  use_auth_token="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")

silence_duration = 1000
some_silence = AudioSegment.silent(duration=silence_duration) 

r = sr.Recognizer()

router = APIRouter()

@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    
    start = time.time()
    upload_filename = file.filename.split(".")[0]
    org_filename = upload_filename + '_' + str(round(time.time())) # 파일명에 타임스탬프 추가
    # print("filename : " + upload_filename)
    # print("org_filename : " + org_filename)
    file_segments = "file_segments" # 분할된 음성파일 저장 디렉터리
    output_folder = os.path.join(file_segments, org_filename + "_segments")    # file_segments/파일명_segments/
    rttm_dirs = "rttm_dirs" # rttm 파일 저장 디렉터리
    speaker_dirs = "speaker_dirs" # pickle 파일 저장 디렉터리
    scripts_txt_dir = "scripts_text"  # text 파일 저장 디렉터리
    speaker_scripts_dir = os.path.join(scripts_txt_dir, org_filename)

    if not os.path.exists(file_segments):
        os.makedirs(file_segments)
        
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    if not os.path.exists(rttm_dirs):
        os.makedirs(rttm_dirs)

    if not os.path.exists(speaker_dirs):
        os.makedirs(speaker_dirs)

    if not os.path.exists(scripts_txt_dir):
        os.makedirs(scripts_txt_dir)      

    if not os.path.exists(speaker_scripts_dir):
            os.makedirs(speaker_scripts_dir)

    byte_file = await file.read()
    audio = io.BytesIO(byte_file)
    diarization = pipeline(audio)  

    rttm_name = os.path.join(rttm_dirs, org_filename + ".rttm")
    with open(rttm_name, "w") as rttm: # rttm_dirs/파일명.rttm 저장
        diarization.write_rttm(rttm)

    for turn, _, speaker in diarization.itertracks(yield_label=True):
        print(str(turn.start) + " -- " + str(turn.end) + " -- " + str(turn.duration)+ " -- " + str(turn.overlaps))

    with open(rttm_name) as f:
            lines = f.readlines()

    audio.seek(0)
    audio_segment = AudioSegment.from_file(audio, format="wav")

    for line in lines:
        line = line.replace('\r','').replace('\n','')
        line_arr = line.split(' ')

        seg_start = int(line_arr[3].replace('.',''))
        seg_duration = int(line_arr[4].replace('.',''))
        seg_speaker = line_arr[7]
        seg_end = seg_start + seg_duration
        
        audio_segment_file_name = os.path.join(output_folder, seg_speaker + "_" + str(seg_start) + ".wav")

        audio2 = audio_segment[seg_start:seg_end]
        audio2.export(audio_segment_file_name, format="wav")

    speaker_texts = {}    # 화자별 텍스트 저장을 위한 딕셔너리 초기화
    file_list = [f for f in os.listdir(output_folder) if f.endswith(".wav")]    # 세그먼트 파일 목록 가져오기
    print(file_list)

    # 파일 이름에서 nnnn 부분 추출 및 정렬 -> nnnn은 음성파일에서 화자 존재하기 시작한 시간(분,초)
    file_list.sort(key=lambda x: int(x.split('_')[2].split('.')[0]))    # 시간 순서대로 정렬
    
    for file_name in file_list: # 각 파일에 대해 음성 인식 수행
        
        speaker_id = file_name.split('_')[1]    # 화자 ID 추출 (예: "SPEAKER_00_31.wav"에서 00 추출)
        
        if speaker_id not in speaker_texts: # 화자 ID에 해당하는 텍스트 리스트가 없으면 초기화
            speaker_texts[speaker_id] = []        
        
        file_path = os.path.join(output_folder, file_name)  # 오디오 파일 경로 설정
        
        with sr.AudioFile(file_path) as source: # 오디오 파일을 읽고 음성 인식 수행
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

    speaker_dir_name = os.path.join(speaker_dirs, org_filename + "_dict.pickle")
    joblib.dump(speaker_texts, speaker_dir_name)

    selected_speaker = []
        # 화자별 텍스트 파일로 저장
    for speaker_id, texts in speaker_texts.items():
        # print("for문 : " , speaker_id)
        selected_speaker.append(speaker_id)
        speaker_text_file = os.path.join(speaker_scripts_dir, f"{upload_filename}_{speaker_id}.txt")
        with open(speaker_text_file, "w", encoding="utf-8") as f:
            for text in texts:
                f.write(text + "\n")

    print("for문 밖 : " , selected_speaker)
    # 텍스트 다운로드 인스턴스 생성
    text_download_link  = TextDownlaod(selected_speaker, speaker_scripts_dir, upload_filename)      
    text_download_links = text_download_link.generate_txt_links()      
    print("text_download_links :", text_download_links)

    duration = time.time() - start
    print("duration(sec) :", duration)

    response_data = {
        "org_filename": org_filename,   # 원본파일명_타임스탬프.wav
        "speaker_texts": speaker_texts, # {화자 코드 : 내용}
        "duration": duration,            # 소요시간
        "text_download_links": text_download_links
    }

    return JSONResponse(content=response_data)