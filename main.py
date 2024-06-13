# fastapi 모듈들을 불러와서 한번에 서버 실행
# 유저 인풋을 DB든 저장해야할듯(timestamp 등..)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import speaker_google_download_hs
import speaker_google_fastapi
import make_audio_api

app = FastAPI()

app.add_middleware(
    CORSMiddleware
  , allow_origins=["*"]
  , allow_credentials=True
  , allow_methods=["*"]
  , allow_headers=["*"]
)

# 1. 음성파일 녹음하는 서비스 호출.
app.include_router(make_audio_api.router, prefix="/api")
# 2.음성 파일 업데이트 하고, 화자 분활하는 서비스 호출.
app.include_router(speaker_google_fastapi.router, prefix="/api")
# 3.화자 분활 된 음성 파일 다운로드 하는 서비스 호출.
app.include_router(speaker_google_download_hs.router, prefix="/api")
