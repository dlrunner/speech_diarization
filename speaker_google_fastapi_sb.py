from pyannote.audio import Pipeline
import time
from pydub import AudioSegment
import os
import speech_recognition as sr
from fastapi.responses import JSONResponse

# Ensure ffmpeg path is correctly set for pydub
AudioSegment.converter = 'C:\\ffmpeg\\bin\\ffmpeg.exe'

# Load diarization pipelines
r = sr.Recognizer()

def pipeline_test(pipeline_name, file_path):
    pipeline = Pipeline.from_pretrained(
    pipeline_name,
    use_auth_token="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"
)
    print("\nmodel name: ",pipeline_name)

    start = time.time()

    upload_filename = os.path.splitext(os.path.basename(file_path))[0]
    org_filename = f"{upload_filename}_{str(round(time.time()))}" # 파일명에 타임스탬프 추가

    file_segments = "file_segments"  # 분할된 음성파일 저장 디렉터리
    output_folder = os.path.join(file_segments, f"{org_filename}_segments")  # file_segments/파일명_segments/
    rttm_dirs = "rttm_dirs"  # rttm 파일 저장 디렉터리
    speaker_dirs = "speaker_dirs"  # pickle 파일 저장 디렉터리
    scripts_txt_dir = "scripts_text"  # text 파일 저장 디렉터리
    speaker_scripts_dir = os.path.join(scripts_txt_dir, org_filename)

    os.makedirs(file_segments, exist_ok=True)
    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(rttm_dirs, exist_ok=True)
    os.makedirs(speaker_dirs, exist_ok=True)
    os.makedirs(scripts_txt_dir, exist_ok=True)
    os.makedirs(speaker_scripts_dir, exist_ok=True)

    # Process the diarization
    diarization = pipeline({'audio': file_path})

    rttm_name = os.path.join(rttm_dirs, f"{org_filename}.rttm")
    with open(rttm_name, "w") as rttm:
        diarization.write_rttm(rttm)

    with open(rttm_name) as f:
        lines = f.readlines()

    audio_segment = AudioSegment.from_file(file_path, format="wav")

    for line in lines:
        line = line.strip()
        line_arr = line.split()
        seg_start = float(line_arr[3])
        seg_duration = float(line_arr[4])
        seg_speaker = line_arr[7]
        seg_end = seg_start + seg_duration

        audio_segment_file_name = os.path.join(output_folder, f"{seg_speaker}_{int(seg_start * 1000)}.wav")

        audio2 = audio_segment[int(seg_start * 1000):int(seg_end * 1000)]
        audio2.export(audio_segment_file_name, format="wav")

    speaker_texts = {}  # 화자별 텍스트 저장을 위한 딕셔너리 초기화
    file_list = [f for f in os.listdir(output_folder) if f.endswith(".wav")]

    file_list.sort(key=lambda x: int(x.split('_')[1].split('.')[0]))  # 시간 순서대로 정렬

    for file_name in file_list:
        speaker_id = file_name.split('_')[0]  # 화자 ID 추출
        if speaker_id not in speaker_texts:
            speaker_texts[speaker_id] = []

        segment_path = os.path.join(output_folder, file_name)

        with sr.AudioFile(segment_path) as source:
            audio = r.record(source)
            try:
                text = r.recognize_google(audio, language='ko')
                speaker_texts[speaker_id].append(text)
                print(f"화자 {speaker_id}: {text}")
            except sr.UnknownValueError:
                print(f"화자 {speaker_id}: 인식 불가")
            except sr.RequestError as e:
                print(f"화자 {speaker_id}: 요청 오류 {e}")
            print("----" * 10)

    for speaker_id, texts in speaker_texts.items():
        speaker_text_file = os.path.join(speaker_scripts_dir, f"{upload_filename}_{speaker_id}.txt")
        with open(speaker_text_file, "w", encoding="utf-8") as f:
            for text in texts:
                f.write(text + "\n")

    duration = time.time() - start
    print("duration(sec):", duration)

    response_data = {
        "org_filename": org_filename,  # 원본파일명_타임스탬프.wav
        "speaker_texts": speaker_texts, # {화자 코드 : 내용}
        "duration": duration  # 소요시간
    }
    print('\n\n')
    return JSONResponse(content=response_data)

file_path = input("파일 상대 경로 입력 후 Enter: ")
pipeline_test("pyannote/speaker-diarization-3.1", file_path)
pipeline_test("pyannote/speaker-diarization", file_path)
