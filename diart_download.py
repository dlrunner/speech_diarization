import glob
import os
import joblib
from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()

@router.post("/download_txt/")
async def download_txt_file(request: Request):
    data = await request.json()
    speaker_id = data.get("speaker_id")
    filename = data.get("filename")
    scripts_txt_dir = os.path.join("scripts_text", filename)
    upfile = filename.split("_")[0]
    downfile = f"{upfile}_{speaker_id}.txt"
    file_path = os.path.join(scripts_txt_dir, downfile)
    print("file_path : " + file_path)
    print("downfile : " + downfile)
    return FileResponse(file_path, filename=downfile, media_type='text/plain')

@router.post("/download_wav/")
async def download_txt_file(request: Request):
    print("--- wav down in ---")
    data = await request.json()
    speaker_id = data.get("speaker_id")
    filename = data.get("filename")
    print("filename : ", filename)

    combind_wav_dirs = "combind_wav"
    if not os.path.exists(combind_wav_dirs):
        os.makedirs(combind_wav_dirs)
        
    pkl_data = joblib.load('speaker_dirs\\'+filename+'_dict.pickle')
    print("pkl_data : ", pkl_data)
    print("--- wav down out ---")
    return 0
    # scripts_txt_dir = os.path.join("scripts_text", filename)
    # upfile = filename.split("_")[0]
    # downfile = f"{upfile}_{speaker_id}.txt"
    # file_path = os.path.join(scripts_txt_dir, downfile)
    # print("file_path : " + file_path)
    # print("downfile : " + downfile)
    # return FileResponse(file_path, filename=filename, media_type='audio/wav')