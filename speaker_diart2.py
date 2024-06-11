from pydub import AudioSegment
import os

AudioSegment.converter = 'C:\\ffmpeg\\bin\\ffmpeg.exe'

#some silence. Not really needed but add it to create some space between the segments
silence_duration = 1000
some_silence = AudioSegment.silent(duration=silence_duration) 
org_filename = "speech2"    # 파일명 변수로 받음
org_filepath = "source\\" + org_filename    # 잘라낼 wav파일 원본 경로/파일명 (.wav)확장자명 없는상태
output_folder = "file_segments\\" + org_filename + "_segments\\"    # 잘라낸 음성파일 새로 저장할 경로 -> file_segments/파일명_segments/

if not os.path.exists(output_folder):   # 잘라낸 음성파일 새로 저장할 경로로 폴더 생성
    os.makedirs(output_folder)
#my audio file from file
my_original_audio = AudioSegment.from_wav(org_filepath + ".wav")    # 잘라내기 전 원본 음성파일 변수로 지정

#read the RTTM file and process the contents
with open(org_filename + '.rttm') as f:
    lines = f.readlines()

for line in lines:
    line = line.replace('\r','').replace('\n','')
    line_arr = line.split(' ')
    
    #create variables we will need
    seg_start = int(line_arr[3].replace('.',''))
    seg_duration = int(line_arr[4].replace('.',''))
    seg_speaker = line_arr[7]
    seg_end = seg_start + seg_duration
    audio_segment_file_name = output_folder + seg_speaker + "_" + str(seg_start) + ".wav"
    
    #an empty segemnt for new audio. The silence probably not necessary but lets add it for now
    # empty = AudioSegment.empty()
    # empty = empty.append(some_silence, crossfade=0)
    # empty = empty.append(my_original_audio[seg_start:seg_end], crossfade=0)
    # empty = empty.append(some_silence, crossfade=0)
    t1 = float(line_arr[3])
    t2 = float(line_arr[3]) + float(line_arr[4])
    audio = my_original_audio[t1*1000 : t2*1000]
    audio.export(audio_segment_file_name, format="wav")