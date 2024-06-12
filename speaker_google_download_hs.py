from fastapi import FastAPI, Request, Form, APIRouter
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
import os
import joblib
from pydub import AudioSegment
import glob

router = APIRouter()
templates = Jinja2Templates(directory="templates")
org_filename = 'user001_1718176705'
combined_speaker_dir = 'filtered_speaker_audio'
scripts_txt_dir = "scripts_text"

def generate_wav_links(selected_speaker):
    print("wav_gen_link in")
    base_path = 'file_segments\\'+org_filename+'_segments'
    wav_file_links = {}
    for key in selected_speaker.keys():
        print('wav_gen_key:',key)
        # 파일 경로를 설정. 여기서는 단순히 키와 파일명을 일치시키는 방식.
        file_list = glob.glob(f"{base_path}\\SPEAKER_{key}*.wav")
        print('file_list', file_list)
        wavs = [AudioSegment.from_wav(wav) for wav in file_list]
        combined = wavs[0]

        for wav in wavs[1:]:
            combined = combined.append(wav)
        if not os.path.exists(combined_speaker_dir):
            os.makedirs(combined_speaker_dir)
        file_link =  org_filename+'_SPEAKER'+key+'.wav'
        file_path = os.path.join(combined_speaker_dir, file_link)
        combined.export(file_path, format="wav")
        wav_file_links[key] = file_path
        print('file_path:',file_path)

    return wav_file_links

def generate_txt_links(selected_speaker):
    print("txt_gen_link in")
    txt_file_links = {}
    
    for key in selected_speaker.keys():
        print('txt_gen_key:',key)

        txt_file_path = os.path.join(scripts_txt_dir, f"{org_filename}_{key}.txt")
        # 파일 경로를 설정. 여기서는 단순히 키와 파일명을 일치시키는 방식.
        file_list = glob.glob(txt_file_path)
        print('file_list', file_list)
        
        if file_list:  # 파일이 존재하는 경우에만 링크를 추가
            txt_file_links[key] = file_list[0]
            print('txt_file_path:', file_list[0])

    return txt_file_links

@router.get("/", response_class=JSONResponse)
async def get_speaker():
    print("main in")
    data = joblib.load('speaker_dirs\\'+org_filename+'_dict.pickle')

    return JSONResponse(data)

@router.post("/filter", response_class=HTMLResponse)
async def filter_speaker(request: Request):
    print("filter in")
    form_data = await request.form()
    selected_speaker = {key: True for key in form_data.keys()}
    wav_links = generate_wav_links(selected_speaker)
    txt_links = generate_txt_links(selected_speaker)
    print('wav_links : ',wav_links)
    print('wav_links : ',txt_links)
    return templates.TemplateResponse("checkbox_hs.html", {"request": request, "data": selected_speaker, "wav_files": wav_links, "txt_files": txt_links})

@router.get("/filtered_speaker_audio/{file_name}", response_class=FileResponse)
async def download_wav_file(file_name: str):
    file_path = os.path.join(combined_speaker_dir, file_name)
    print('download_file_path:',file_path)

    return FileResponse(file_path, filename=file_name, media_type='audio/wav')

@router.get("/scripts_text/{file_name}", response_class=FileResponse)
async def download_txt_file(file_name: str):
    file_path = os.path.join(scripts_txt_dir, file_name)
    print('download_file_path:',file_path)

    return FileResponse(file_path, filename=file_name, media_type='txt')
