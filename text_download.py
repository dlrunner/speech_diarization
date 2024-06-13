import glob
import os

class TextDownlaod:

    def __init__(self, selected_speaker, scripts_txt_dir, org_filename):
        self.selected_speaker = selected_speaker
        self.scripts_txt_dir  = scripts_txt_dir
        self.org_filename     = org_filename

    # 텍스트 다운로드 링크 생성하는 메소드
    def generate_txt_links(self):
        
        print("generate_txt_links 메소드 호출")
        txt_file_links = {}
        
        #for key in self.selected_speaker.keys():
        for speaker_id in self.selected_speaker: 

            print('txt_gen_key:', speaker_id)
            #txt_file_path = os.path.join(self.scripts_txt_dir, f"{self.org_filename}_{speaker_id}.txt")
            txt_file_path = os.path.join(self.scripts_txt_dir, f"{self.org_filename}_{speaker_id}.txt").replace("\\", "/")
            # 파일 경로를 설정. 여기서는 단순히 키와 파일명을 일치시키는 방식.
            file_list = glob.glob(txt_file_path)
            print('file_list', file_list)
            
            if file_list:  # 파일이 존재하는 경우에만 링크를 추가
                txt_file_links[speaker_id] = 'http://localhost:8000/'+file_list[0]
                print('txt_file_path:', file_list[0])

        return txt_file_links