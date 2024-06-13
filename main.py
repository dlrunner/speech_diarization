# fastapi 모듈들을 불러와서 한번에 서버 실행
# 유저 인풋을 DB든 저장해야할듯(timestamp 등..)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import speaker_google_download_hs
import make_audio_api
import speaker_google_fastapi
import text_download
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# scripts_text 디렉토리를 정적 파일 서비스로 추가
# app.mount("/scripts_text", StaticFiles(directory="C:/Users/user/dev/team/speech_diarization/scripts_text"), name="scripts_text")

app.add_middleware(
      CORSMiddleware
    , allow_origins=["*"]
    , allow_credentials=True
    , allow_methods=["*"]
    , allow_headers=["*"]
)
app.include_router(make_audio_api.router, prefix="/api")
app.include_router(speaker_google_fastapi.router, prefix="/api")
app.include_router(text_download.router, prefix="/api")
# app.include_router(speaker_google_download_hs.router, prefix="/api")
