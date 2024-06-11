from pydub import AudioSegment
import os
from io import BytesIO

def split_audio(file: BytesIO, rttm_file: str, output_dir: str = "file_segments"):
    AudioSegment.converter = 'C:\\ffmpeg\\bin\\ffmpeg.exe'

    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Load the audio file
    audio = AudioSegment.from_file(file, format="wav")

    # Read and process the RTTM file
    with open(rttm_file) as f:
        lines = f.readlines()

    for idx, line in enumerate(lines, start=1):
        line = line.strip()
        line_arr = line.split(' ')
        
        # Create variables needed
        t1 = float(line_arr[3]) * 1000
        t2 = (float(line_arr[3]) + float(line_arr[4])) * 1000
        seg_speaker = str(idx)  # speaker 번호 생성
        audio_segment_file_name = f"{output_dir}/{seg_speaker}.wav"  # 파일명 생성
        
        # Slice the audio segment
        segment = audio[t1:t2]
        segment.export(audio_segment_file_name, format="wav")

    # Check if all files were created successfully
    all_files_created = all(os.path.exists(f"{output_dir}/{i}.wav") for i in range(1, len(lines) + 1))
    return all_files_created
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import shutil
from io import BytesIO

app = FastAPI()

class RTTMFile(BaseModel):
    content: str

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...), rttm_file: UploadFile = File(...)):
    try:
        # Save the uploaded audio file temporarily
        with open("temp_audio.wav", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Save the uploaded RTTM file temporarily
        with open("temp_audio.rttm", "wb") as buffer:
            shutil.copyfileobj(rttm_file.file, buffer)

        # Process the files
        with open("temp_audio.wav", "rb") as audio_file:
            audio_bytes = BytesIO(audio_file.read())
            success = split_audio(audio_bytes, "temp_audio.rttm")

        if success:
            return {"message": "모든 파일이 성공적으로 생성되었습니다."}
        else:
            return {"message": "일부 파일이 생성되지 않았습니다."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up temporary files
        if os.path.exists("temp_audio.wav"):
            os.remove("temp_audio.wav")
        if os.path.exists("temp_audio.rttm"):
            os.remove("temp_audio.rttm")
