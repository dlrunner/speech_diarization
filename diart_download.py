import glob
import os
import glob
from fastapi import APIRouter, Request
from fastapi.responses import FileResponse
from fastapi.responses import StreamingResponse
from pydub import AudioSegment
import zipfile
from typing import List
from tempfile import NamedTemporaryFile

router = APIRouter()

@router.post("/download_txt/")
async def download_txt_file(request: Request):
    data = await request.json()
    speaker_id = data.get("speaker_id")
    filename = data.get("filename")
    scripts_txt_dir = os.path.join("scripts_text", filename)
    upfile = filename.split("_")[0]
    textfile = f"{upfile}_{speaker_id}.txt"
    file_path = os.path.join(scripts_txt_dir, textfile)
    print("file_path : " + file_path)
    print("textfile : " + textfile)
    return FileResponse(file_path, filename=textfile, media_type='text/plain')

@router.post("/download_all_txt/")
async def download_all_txt(request: Request):
    
    data = await request.json()

    speaker_ids = data.get("selectedIds")
    filename    = data.get("filename")
    scripts_txt_dir = os.path.join("scripts_text", filename)
    upfile = filename.split("_")[0]
    textfiles = [f"{upfile}_{speaker_id}.txt" for speaker_id in speaker_ids]

     # Create a temporary directory to store the compressed files
    with NamedTemporaryFile(delete=False) as temp_zip_file:
        with zipfile.ZipFile(temp_zip_file, 'w') as zip_file:
            for textfile in textfiles:
                file_path = os.path.join(scripts_txt_dir, textfile)
                if os.path.exists(file_path):
                    zip_file.write(file_path, arcname=textfile)

    # Open the temporary zip file in read-binary mode and return it as a StreamingResponse
    with open(temp_zip_file.name, 'rb') as file:
        file_content = file.read()

    return StreamingResponse(
        iter([file_content]),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={filename}.zip"}
    )

@router.post("/download_wav/")
async def download_txt_file(request: Request):
    print("--- wav down in ---")
    data = await request.json()
    speaker_id = data.get("speaker_id")
    filename = data.get("filename")
    upfile = filename.split("_")[0]
    print("filename : ", filename)

    combind_wav_dirs = f"combind_wav\\{filename}"
    if not os.path.exists(combind_wav_dirs):
        os.makedirs(combind_wav_dirs)
    
    base_path = os.path.join("file_segments", f"{filename}_segments")
    file_list = glob.glob(f"{base_path}\\SPEAKER_{speaker_id}*.wav")
    wavs = [AudioSegment.from_wav(wav) for wav in file_list]
    combined = wavs[0]
    for wav in wavs[1:]:
        combined = combined.append(wav)
    combined_wav = f"{upfile}_{speaker_id}.wav"
    file_path = os.path.join(combind_wav_dirs, combined_wav)
    combined.export(file_path, format="wav")
    print("file_path : " + file_path)
    print("combined_wav : " + combined_wav)

    return FileResponse(file_path, filename=combined_wav, media_type='audio/wav')
