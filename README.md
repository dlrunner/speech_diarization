## speech_diarization 

1. speech(.wav)를 참고하여 rttm 파일에 화자 분류 데이터 저장

2. rttm 파일을 참고하여 speech 파일을 화자분할

3. 분할된 오디오 파일에서 transcript를 작성(오디오 -> 텍스트 변환)

# nlrunner
AI개발 과정, 미니프로젝트 코드입니다. Ai모델을 활용하여 "화자 분리 오디오필터링"서비스 입니다

## 👨‍🏫 프로젝트 소개
"회의나 강의를 녹음하여 원하는 화자의 내용을 듣거나 보고싶은 분들 또는 청각이 불편한 분들까지 유용하게 사용할 수 있는 서비스 입니다."

## ⏲️ 개발 기간 
- 2024.06.10(월) ~ 2024.06.18(화)
- 아이디어의 이해
- 아이디어 노트 작성
- 코딩
- 아이디어 발표
- 발표평가
  
## 🧑‍🤝‍🧑 개발자 소개 
- **우성빈** : 팀장, AI모델구현, 프론트엔드구성
- **박광희** : AI모델활용, 프론트엔드구성, 회의록작성
- **이재준** : AI모델활용, 프론트엔드구성, 노션문서작성
- **강윤지** : AI모델구현, 백엔드기능구현
- **금현수** : AI모델구현, 백엔드기능구현
- **백승용** : AI모델활용, Git형상관리, 계획서/WBS작성, 코드 통합
  
## 💻 개발환경
- **Version** : python(v.3.12), Node.js (v.20.14.0), Yarn (v.1.22.22), vite(v1.5.2)
- **IDE** : Visual Studio Code
- **Framework** : Frond-end: React(Vite), Back-end: Fast-api

## ⚙️ 기술 스택
- **Server** : Uvicorn
- **아이디어 회의** : Jira, Notion, Zoom
- ![image](https://github.com/dlrunner/speech_diarization/assets/159866148/305204df-5661-4f1d-9563-f910c841279d)


## 📝 프로젝트 아키텍쳐


## 📌 주요 기능
- wav 파일을 받아 화자 분리
- 화자 분리된 txt, wav 파일 다운로드
