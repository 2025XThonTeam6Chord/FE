# 다독 (Dadok)

동국대학교 심리 건강 관리 프로젝트

## 프로젝트 구조

```
XTHON/
├── result/          # 웹 애플리케이션 (React + Vite)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── extension/       # Chrome Extension
    ├── manifest.json
    ├── content.js
    ├── style.css
    └── README.md
```

## 주요 기능

### 1. 웹 애플리케이션 (`result/`)
- 심리 분석 결과 페이지
- Bento Grid 스타일 대시보드
- PDF 내보내기 기능

### 2. Chrome Extension (`extension/`)
- 동국대학교 이클래스에서 심리 상태 기록
- Floating Action Button (FAB)
- 감정 선택 메뉴

## 시작하기

### 웹 애플리케이션 실행
```bash
cd result
npm install
npm run dev
```

### Chrome Extension 설치
1. Chrome 브라우저에서 `chrome://extensions/` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `extension/` 폴더 선택

## 기술 스택

- **Frontend**: React 19, Vite 7
- **Charts**: Recharts
- **Icons**: React Icons
- **Extension**: Manifest V3

