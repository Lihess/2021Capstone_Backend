# 📡 2021Capstone_Backend

### <center><b>" 냉장고 속 식자재를 효율적으로 관리하자! "</b></center> <br/>

📜 github 초기 설정

        git init  
        git add .  
        git commit -m '내용'   
        git remote add origin https://github.com/Lihess/2021Capstone_Backend
        git push -u origin master
        git clone 


📜 github 사용법  

        1. 푸시 : 작업 내용 깃허브에 올리기
            git add 파일명  
            git add . : 작업한 파일 전체 업로드
            git commit -m '커밋 내용'
            git push origin 브랜치 명
        2. 풀 : 깃허브에 올라온 것 받기
            git pull origin 받을브랜치명
        3. 브랜치 관련
            git branch 브랜치명 : 브랜치 생성  
            git checkout 브랜치명 : 브랜치 전환, 코드가꼬이는 것을 막기 위해 해당 브랜치에서 작업합니당  
        4. 브랜치 병합
            git checkout 상위브랜치
            git merge 병합할브랜치 

🌱 github branchs

        master : 최종 작업 상태 (배포버전)  
        test : 개인 작업을 합치기 위한 브랜치  
        seo : 서상균님의 개인 브랜치  
        lee : 이은비님의 개인 브랜치
  
🗂 디렉토리 구조

        ├─node_modules   
        │  └─.bin  
        ├─public : 사용할 이미지 저장용
        └─src  
           ├─config : 설정
           ├─controllers : MVC 중 Controller으로 주요 로직 정의
           ├─models : MVC 중 Model로, DB 모델 정의
           └─routes : 사용할 REST api 선언 


🖥 Front-End : https://github.com/pyo-sh/2021Capstone_Frontend  
📅 Notion : https://www.notion.so/2021-0bdb752d2e2c47cba89ec03cff7af398
