# 학점 계산기 (React + Vite)

## 실행
npm install
npm run dev

## 엑셀 불러오기
- 포털에서 성적표를 엑셀(.xlsx/.xls) 또는 CSV로 내려받아 업로드
- 헤더에 `과목명/교과목명`, `학점`, `성적/등급`, `이수구분` 같은 단어가 있으면 자동 인식
- `sample.csv`로 테스트 가능

## 파일 구조
src/
  App.jsx         메인 화면 (과목 입력 표 + 결과)
  grades.js       성적표(A+=4.5...)와 평점 계산 함수
  parseExcel.js   엑셀/CSV → 과목 배열 변환
  Graduation.jsx  졸업요건 계산기