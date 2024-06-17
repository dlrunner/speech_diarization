# fastapi 모듈들을 불러와서 한번에 서버 실행
# 추후 사용자 input 값을 DB든 저장해야할듯(timestamp 등..)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import make_audio_api
import speaker_google_fastapi
import diart_download

app = FastAPI()

app.add_middleware(
      CORSMiddleware
    , allow_origins=["*"]
    , allow_credentials=True
    , allow_methods=["*"]
    , allow_headers=["*"]
)


# 0. /api 경로로 들어오는 요청을 make_audio_api.router, speaker_google_fastapi, diart_download 에서 정의된 엔드포인트로 라우팅합니다.

# 1. make_audio_api: 실시간 녹음 기능을 제공하며, 입력된 음성을 녹음하여 wav 파일로 생성하는 API 라우터를 정의하는 모듈.
app.include_router(make_audio_api.router, prefix="/api")
app.include_router(speaker_google_fastapi.router, prefix="/api")
app.include_router(diart_download.router, prefix="/api")
