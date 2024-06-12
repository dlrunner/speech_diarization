from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from rec_audio import VoiceRecorder

app = FastAPI()
# FastApi 애플리케이션에서 Jinja2 템플릿 엔진을 사용하도록 설정
templates = Jinja2Templates(directory="templates")

@app.get("/index")
async def index(request:Request):
    return  templates.TemplateResponse("index.html", {"request":request})

@app.post("/recording")
async def recording(request:Request):
    
    recorder = VoiceRecorder()
    recorder.speak("안녕하세요. 2초 후에 '말씀하세요'")
    text = recorder.get_audio()

    with open('memo.txt', 'w', encoding='utf-8') as f:
        f.write(str(text) + "\n")
    
    return {"status": "recording completed", "text": text}
