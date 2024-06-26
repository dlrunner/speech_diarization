<div style="text-align: center;">
	<img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=DLRunner-Team!&fontSize=90"  alt=""/>	
</div>

## speech_diarization 

1. speech(.wav)를 참고하여 rttm 파일에 화자 분류 데이터 저장
   * speech : input 데이터로 사용된 음성파일(확장자 wav)

3. 1번을 통해 생성된 rttm 파일을 input 데이터로 사용하여, speech 파일을 화자별로 분할하여 output 생성(.wav 파일, 오디오 → 오디오)

4. 분할 생성된 오디오 파일을 텍스트로 변환하여 해당 내용을 txt 파일로 추출(오디오 → 텍스트 변환)

# nlrunner
AI개발 과정, 미니프로젝트 코드입니다. Ai모델을 활용하여 "화자 분리 오디오필터링"서비스 입니다

## 👨‍🏫 프로젝트 소개
"회의나 강의를 녹음하여 원하는 화자의 내용을 듣거나 보고싶은 분들 또는 청각이 불편한 분들까지 유용하게 사용할 수 있는 서비스 입니다."

## 🎥 실행 화면
![ezgif-2-e08c37b2ce](https://github.com/dlrunner/speech_diarization/assets/159866148/8b133f1e-3919-4a02-abb1-d9b3edd7fccf)
![ezgif-2-44a9fd1d43](https://github.com/dlrunner/speech_diarization/assets/159866148/4d2410e5-8e1e-414c-bf9c-dc948d297987)


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
- **ASGI Server**: Uvicorn
- **Version Control**: Git
- **아이디어 회의** : Jira, Notion, Zoom


## 📝 프로젝트 아키텍쳐
![image](https://github.com/dlrunner/speech_diarization/assets/159866148/eae32553-6834-482d-8093-77fd634ca9fd)


## 📌 주요 기능
- wav 파일을 받아 화자 분리
- 화자 분리된 txt, wav 파일 다운로드
