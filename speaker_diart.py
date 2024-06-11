from pyannote.audio import Pipeline
from pydub import AudioSegment
import time
start = time.time()

pipeline = Pipeline.from_pretrained(
  "pyannote/speaker-diarization-3.1",
  use_auth_token="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")

# run the pipeline on an audio file
# t1 = 119 * 1000 #Works in milliseconds
# t2 = 179 * 1000
# newAudio = AudioSegment.from_wav("speech.wav")
# newAudio = newAudio[t1:t2]
# newAudio.export('speech2.wav', format="wav")
diarization = pipeline("speech2.wav")


# dump the diarization output to disk using RTTM format
with open("audio.rttm", "w") as rttm:
    diarization.write_rttm(rttm)
for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(str(turn.start) + " -- " + str(turn.end) + " -- " + str(turn.duration)+ " -- " + str(turn.overlaps))

print("time :", time.time() - start)