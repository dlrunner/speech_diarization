from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from audioRecognizer import VoiceRecognizer
import signal
import uvicorn

# 오류 발생 시, Control + c로 프로그램 종료가 되지 않는 경우가 있어서 종료 신호를 처리하는 핸들러를 추가 함.
def handle_exit(sig, frame):
    print("Shutting down...")
    # 필요한 종료 작업 수행
    raise SystemExit

# 위의 핸들러 사용을 위한 종료 신호를 등록
signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)

app = FastAPI()
# FastApi 애플리케이션에서 Jinja2 템플릿 엔진을 사용하도록 설정
templates = Jinja2Templates(directory="templates")

# TEST CASE 1 : 웹 브라우저에서 http://127.0.0.1:8000/index 를 호출하고, 프로그램 실행 버튼을 클릭한다.
@app.get("/index")
async def index(request:Request):
    return  templates.TemplateResponse("index.html", {"request":request})

# TEST CASE 2 : TEST CASE 1에서 프로그램 실행 버튼을 클릭하면, 해당 URL을 호출되기 때문에 사용자가 해야할 일 없음.
@app.post("/recording")
async def recording(request:Request):
    
    #2.1 : rec_audio.py의 VoiceRecorder 클래스로 객체 생성
    recorder = VoiceRecognizer()
    recorder.speak("안녕하세요. 2초 후에 '말씀하세요'")
    
    text = recorder.get_audio()
    with open('memo.txt', 'w', encoding='utf-8') as f:
        f.write(str(text) + "\n")
    
    return {"status": "recording completed", "text": text}

if __name__ == "__main__":
    uvicorn.run("mk_audio_api:app", host="127.0.0.1", port=8000)