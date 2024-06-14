# fastapi 모듈들을 불러와서 한번에 서버 실행
# 추후 사용자 input 값을 DB든 저장해야할듯(timestamp 등..)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import make_audio_api
import speaker_google_fastapi
import text_download

app = FastAPI()

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
