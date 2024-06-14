import glob
import os
from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()

class TextDownlaod:

    def __init__(self, selected_speaker, speaker_scripts_dir, upload_filename):
        self.selected_speaker = selected_speaker
        self.speaker_scripts_dir  = speaker_scripts_dir
        self.upload_filename     = upload_filename

    # 텍스트 다운로드 링크 생성하는 메소드
    def generate_txt_links(self):
        
        print("generate_txt_links 메소드 호출")
        txt_file_links = {}
        
        #for key in self.selected_speaker.keys():
        for speaker_id in self.selected_speaker: 

            print('txt_gen_key:', speaker_id)
            #txt_file_path = os.path.join(self.speaker_scripts_dir, f"{self.org_filename}_{speaker_id}.txt")
            txt_file_path = os.path.join(self.speaker_scripts_dir, f"{self.upload_filename}_{speaker_id}.txt").replace("\\", "/")
            txt_file_links[speaker_id] = 'http://localhost:8000/' + txt_file_path
            print('txt_file_links : ', txt_file_links)

        return txt_file_links

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