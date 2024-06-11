from pyannote.audio import Pipeline
from pydub import AudioSegment
import time
start = time.time()

pipeline = Pipeline.from_pretrained(
  "pyannote/speaker-diarization-3.1",
  use_auth_token="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")

org_filename = "speech2"  # 파일명 변수로 받음
org_filepath = "source\\" + org_filename  # 변수에 담은 파일명에 경로추가 -> 경로/파일명

# run the pipeline on an audio file
# t1 = 119 * 1000 #Works in milliseconds
# t2 = 179 * 1000
# newAudio = AudioSegment.from_wav("speech.wav")
# newAudio = newAudio[t1:t2]
# newAudio.export('speech2.wav', format="wav")
diarization = pipeline(org_filepath + ".wav") # 경로/파일명.wav

# dump the diarization output to disk using RTTM format
with open(org_filename + ".rttm", "w") as rttm: # 현재 폴더에 파일명.rttm 으로 저장 -> 경로 새로 추가 및 지정 필요
    diarization.write_rttm(rttm)
for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(str(turn.start) + " -- " + str(turn.end) + " -- " + str(turn.duration)+ " -- " + str(turn.overlaps))

print("time :", time.time() - start)