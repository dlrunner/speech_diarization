from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse
import os
import joblib
from pydub import AudioSegment
import glob

app = FastAPI()
templates = Jinja2Templates(directory="templates")
org_filename = 'user001_1718156474'
combined_speaker_dir = 'filtered_speaker_audio'
def generate_file_links(selected_speaker):
    
    base_path = 'file_segments\\'+org_filename+'_segments'
    file_links = {}
    # data = joblib.load('speaker_dirs\\user001_1718156474_dict.pickle')
    for key in selected_speaker.keys():
        print('key:',key)
        # 파일 경로를 설정. 여기서는 단순히 키와 파일명을 일치시키는 방식.
        file_list = glob.glob(f"{base_path}\\SPEAKER_{key}*.wav")
        print('file_list', file_list)
        wavs = [AudioSegment.from_wav(wav) for wav in file_list]
        combined = wavs[0]

        for wav in wavs[1:]:
            combined = combined.append(wav)
        if not os.path.exists(combined_speaker_dir):   # rttm 디렉터리 생성
            os.makedirs(combined_speaker_dir)
        file_link =  org_filename+'_SPEAKER'+key+'.wav'
        file_path = os.path.join(combined_speaker_dir, file_link)
        combined.export(file_path, format="wav")
        file_links[key] = file_path
        print('file_path:',file_path)

    return file_links

@app.get("/", response_class=HTMLResponse)
async def get_speaker(request: Request):

    data = joblib.load('speaker_dirs\\'+org_filename+'_dict.pickle')

    return templates.TemplateResponse("checkbox.html", {"request": request, "data": data})

@app.post("/filter", response_class=HTMLResponse)
async def filter_speaker(request: Request):
    form_data = await request.form()
    selected_speaker = {key: True for key in form_data.keys()}
    file_links = generate_file_links(selected_speaker)
    print('file_links:',file_links)
    return templates.TemplateResponse("checkbox.html", {"request": request, "data": selected_speaker, "files": file_links})

@app.get("/filtered_speaker_audio/{file_name}", response_class=FileResponse)
async def download_file(file_name: str):
    file_path = os.path.join(combined_speaker_dir, file_name)
    print('file_path:',file_path)

    # file_path = os.path.join(combined_speaker_dir, file_name)
    return FileResponse(file_path, filename=file_name, media_type='audio/wav')
