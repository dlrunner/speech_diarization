#2. rttm 파일을 참고하여 speech 파일을 화자분할
from pydub import AudioSegment
AudioSegment.converter = 'C:\\ffmpeg\\bin\\ffmpeg.exe'

#some silence. Not really needed but add it to create some space between the segments
silence_duration = 1000
some_silence = AudioSegment.silent(duration=silence_duration) 

#my audio file from file
my_original_audio = AudioSegment.from_wav("speech.wav")

#read the RTTM file and process the contents
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
    audio = my_original_audio[t1*1000 : t2*1000]
    audio.export(audio_segment_file_name, format="wav")