from fastapi import FastAPI, File, UploadFile
from pyannote.audio import Pipeline
import time
import io

start = time.time()
pipeline = Pipeline.from_pretrained(
  "pyannote/speaker-diarization-3.1",
  use_auth_token="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")

app = FastAPI()
@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    byte_file = await file.read()
    audio = io.BytesIO(byte_file)
    diarization = pipeline(audio)
    with open("audio.rttm", "w") as rttm:
        diarization.write_rttm(rttm)
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        print(str(turn.start) + " -- " + str(turn.end) + " -- " + str(turn.duration)+ " -- " + str(turn.overlaps))

    with open('audio.rttm') as f:
    lines = f.readlines()

    for line in lines:
        line = line.replace('\r','').replace('\n','')
        line_arr = line.split(' ')
        
        #create variables we will need
        seg_start = int(line_arr[3].replace('.',''))
        seg_duration = int(line_arr[4].replace('.',''))
        seg_speaker = line_arr[7]
        seg_end = seg_start + seg_duration
        audio_segment_file_name = "file_segments\\" + seg_speaker + str(seg_start) + ".wav"
        
        #an empty segemnt for new audio. The silence probably not necessary but lets add it for now
        # empty = AudioSegment.empty()
        # empty = empty.append(some_silence, crossfade=0)
        # empty = empty.append(my_original_audio[seg_start:seg_end], crossfade=0)
        # empty = empty.append(some_silence, crossfade=0)
        t1 = float(line_arr[3])
        t2 = float(line_arr[3]) + float(line_arr[4])
        audio2 = audio[t1*1000 : t2*1000]
        audio2.export(audio_segment_file_name, format="wav")


print("time :", time.time() - start)