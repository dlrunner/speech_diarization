# fastapi 모듈들을 불러와서 한번에 서버 실행
# 유저 인풋을 DB든 저장해야할듯(timestamp 등..)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import speaker_google_download_hs
import speaker_google_fastapi

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(speaker_google_download_hs.router, prefix="/api")
app.include_router(speaker_google_fastapi.router, prefix="/api")
