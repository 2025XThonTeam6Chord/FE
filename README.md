# 넌 잘못이 없어 - Frontend

동국대학교 학생들의 심리 상태를 모니터링하고 관리하는 통합 대시보드 시스템의 프론트엔드 레포지토리입니다.

## 프로젝트 구조

```
FE/
├── dashboard/          # 관리자 대시보드 (React + Vite)
├── result/             # 심리 상태 리포트 페이지 (React + Vite)
├── extension/          # 크롬 확장 프로그램
├── api/                # API 통신 모듈
└── paper-dashboard-template/  # 대시보드 템플릿 (참고용)
```

## 주요 기능

### 1. 관리자 대시보드 (`dashboard/`)

학생들의 심리 상태를 종합적으로 모니터링하고 관리하는 대시보드입니다.

#### 주요 기능

- **KPI 카드**: 전체 학생 평균 우울 점수, 고위험군 학생 수, 응답률, 상담 신청 건수
- **시계열 차트**: 최근 15주 심리 상태 추이 시각화
- **집단별 분석**: 단과대별/학과별/학년별 스트레스 수준 비교
- **AI 인사이트**: 자동 분석된 심리 상태 트렌드 및 인사이트
- **상담 신청 목록**: 고위험군 학생 목록 및 상담 신청 관리

### 2. 결과 리포트 페이지 (`result/`)

학생 개인이 자신의 심리 상태 리포트를 확인할 수 있는 페이지입니다.

#### 주요 기능

- 심리 상태 리포트 요약
- 감정 트렌드 분석
- 심리적 균형 시각화
- 상세 분석 및 케어 제안
- PDF 내보내기 기능 |

### 3. 크롬 확장 프로그램 (`extension/`)

동국대학교 이클래스에서 심리 상태를 간편하게 기록할 수 있는 브라우저 확장 프로그램입니다.

#### 주요 기능

- Floating Action Button (FAB)을 통한 빠른 감정 기록
- 5가지 감정 선택지 제공
- 이클래스 페이지와 통합

#### 다운로드 및 설치 방법

##### 방법 1: 소스 코드에서 직접 설치 (개발자 모드)

1. **레포지토리 클론 또는 다운로드**

   ```bash
   git clone https://github.com/2025XThonTeam6Chord/FE.git
   cd FE/extension
   ```

2. **Chrome 확장 프로그램 페이지 열기**

   - Chrome 브라우저 주소창에 `chrome://extensions/` 입력
   - 또는 Chrome 메뉴 → 도구 더보기 → 확장 프로그램

3. **개발자 모드 활성화**

   - 페이지 우측 상단의 "개발자 모드" 토글 스위치를 켜기

4. **확장 프로그램 로드**

   - "압축해제된 확장 프로그램을 로드합니다" 버튼 클릭
   - `FE/extension/` 폴더 선택
   - 설치 완료!

5. **확인**
   - 확장 프로그램 목록에 "다독 - 심리 상태 기록"이 표시되면 성공
   - 확장 프로그램 아이콘이 브라우저 툴바에 나타남

##### 방법 2: ZIP 파일로 설치

1. **ZIP 파일 다운로드**

   - GitHub 레포지토리에서 `extension/` 폴더를 ZIP으로 다운로드
   - 또는 다음 명령어로 압축:
     ```bash
     cd FE
     zip -r extension.zip extension/
     ```

2. **ZIP 파일 압축 해제**

   - 다운로드한 `extension.zip` 파일을 원하는 위치에 압축 해제

3. **Chrome에서 로드**
   - `chrome://extensions/` 접속
   - 개발자 모드 활성화
   - "압축해제된 확장 프로그램을 로드합니다" 클릭
   - 압축 해제한 `extension/` 폴더 선택

#### 사용 방법

1. **이클래스 접속**

   - 동국대학교 이클래스(`https://eclass.dongguk.edu`)에 접속

2. **감정 기록**

   - 화면 우측 하단에 나타나는 💭 버튼 클릭
   - 5가지 감정 중 하나 선택:
     - 😊 좋아요
     - 😐 그저 그래요
     - 😢 힘들어요
     - 😰 불안해요
     - 😴 피곤해요

3. **기록 확인**
   - 선택한 감정이 서버로 전송되어 기록됨

#### 업데이트 방법

확장 프로그램을 업데이트하려면:

1. `chrome://extensions/` 접속
2. 해당 확장 프로그램의 "새로고침" 버튼 클릭
3. 또는 확장 프로그램을 제거 후 다시 설치

#### 문제 해결

- **확장 프로그램이 보이지 않는 경우**

  - 개발자 모드가 활성화되어 있는지 확인
  - `extension/` 폴더 내에 `manifest.json` 파일이 있는지 확인

- **이클래스에서 버튼이 나타나지 않는 경우**

  - 확장 프로그램이 활성화되어 있는지 확인
  - 페이지를 새로고침 (F5 또는 Cmd+R)
  - `https://eclass.dongguk.edu` 도메인에서만 작동함

- **권한 오류가 발생하는 경우**
  - `manifest.json`의 `permissions` 설정 확인
  - 확장 프로그램을 제거 후 다시 설치

---

### 4. API 모듈 (`api/`)

대시보드와 백엔드 서버 간의 통신을 담당하는 API 모듈입니다.

#### 주요 API 함수

- `getTotalSummary(userId)`: 전체 정신건강 지표 요약 조회
- `getFilteredScore(filter, userId)`: 집단별 스트레스 점수 조회
- `getAverageScore(userId)`: 주간 평균 심리 점수 조회
- `getReserveList(userId)`: 상담 신청 목록 조회

#### 기술 스택

| 카테고리       | 기술              | 버전   | 용도            |
| -------------- | ----------------- | ------ | --------------- |
| **API Client** | Fetch API         | Native | HTTP 요청       |
| **Runtime**    | JavaScript (ES6+) | -      | 프로그래밍 언어 |

#### 사용 예시

```javascript
import { getTotalSummary } from "../api/dashboard/dashboardApi";

const data = await getTotalSummary("admin");
```

---

## 기술 스택 전체 요약

### Frontend Framework & Library

| 프로젝트      | Framework | 버전   | 특징                           |
| ------------- | --------- | ------ | ------------------------------ |
| **Dashboard** | React     | 18.3.1 | 안정적인 버전, Reactstrap 호환 |
| **Result**    | React     | 19.2.0 | 최신 버전, Material-UI 호환    |

### Build Tools

| 도구                     | 버전   | 용도                     |
| ------------------------ | ------ | ------------------------ |
| **Vite**                 | 7.2.4  | 빠른 개발 서버 및 번들링 |
| **ESLint**               | 9.39.1 | 코드 품질 관리           |
| **@vitejs/plugin-react** | 5.1.1  | React 플러그인           |

### UI & Styling

| 라이브러리          | 버전    | 사용 프로젝트 | 용도                     |
| ------------------- | ------- | ------------- | ------------------------ |
| **Reactstrap**      | 9.2.3   | Dashboard     | Bootstrap React 컴포넌트 |
| **Bootstrap**       | 4.6.2   | Dashboard     | CSS 프레임워크           |
| **Material-UI**     | 7.3.5   | Result        | Material Design 컴포넌트 |
| **@emotion/react**  | 11.14.0 | Result        | CSS-in-JS                |
| **@emotion/styled** | 11.14.1 | Result        | 스타일드 컴포넌트        |
| **Sass**            | 1.94.2  | Dashboard     | CSS 전처리기             |

### Data Visualization

| 라이브러리   | 버전  | 사용 프로젝트     | 용도                  |
| ------------ | ----- | ----------------- | --------------------- |
| **Recharts** | 3.4.1 | Dashboard, Result | 차트 및 그래프 시각화 |

### Icons

| 라이브러리              | 버전    | 사용 프로젝트     | 특징                          |
| ----------------------- | ------- | ----------------- | ----------------------------- |
| **Lucide React**        | 0.554.0 | Dashboard         | 모던한 아이콘 세트            |
| **React Icons**         | 5.5.0   | Dashboard, Result | 다양한 아이콘 라이브러리 통합 |
| **@mui/icons-material** | 7.3.5   | Result            | Material Design 아이콘        |

### Animation & Interaction

| 라이브러리            | 버전     | 사용 프로젝트 | 용도            |
| --------------------- | -------- | ------------- | --------------- |
| **Framer Motion**     | 12.23.24 | Result        | UI 애니메이션   |
| **Perfect Scrollbar** | 1.5.5    | Dashboard     | 커스텀 스크롤바 |

### Utilities

| 라이브러리           | 버전   | 사용 프로젝트 | 용도                |
| -------------------- | ------ | ------------- | ------------------- |
| **date-fns**         | 4.1.0  | Result        | 날짜 처리 및 포맷팅 |
| **react-datepicker** | 8.9.0  | Result        | 날짜 선택 컴포넌트  |
| **react-hot-toast**  | 2.6.0  | Result        | 토스트 알림         |
| **react-share**      | 5.2.2  | Result        | 소셜 미디어 공유    |
| **html2pdf.js**      | 0.12.1 | Result        | PDF 생성            |

### Routing

| 라이브러리           | 버전  | 사용 프로젝트     | 용도                     |
| -------------------- | ----- | ----------------- | ------------------------ |
| **React Router DOM** | 7.9.6 | Dashboard, Result | 클라이언트 사이드 라우팅 |

### Browser Extension

| 기술                   | 버전 | 용도                    |
| ---------------------- | ---- | ----------------------- |
| **Manifest V3**        | 3    | 크롬 확장 프로그램 표준 |
| **Vanilla JavaScript** | ES6+ | 확장 프로그램 로직      |
| **Content Scripts**    | -    | 페이지 주입 스크립트    |

### Development Tools

| 도구                            | 버전             | 용도                    |
| ------------------------------- | ---------------- | ----------------------- |
| **ESLint**                      | 9.39.1           | 코드 린팅               |
| **eslint-plugin-react-hooks**   | 7.0.1            | React Hooks 규칙        |
| **eslint-plugin-react-refresh** | 0.4.24           | React Fast Refresh 지원 |
| **@types/react**                | 18.3.12 / 19.2.5 | TypeScript 타입 정의    |
| **@types/react-dom**            | 18.3.1 / 19.2.3  | React DOM 타입 정의     |

## 🔧 개발 가이드

### 코드 스타일

- ESLint를 사용한 코드 품질 관리
- React Hooks 규칙 준수
- 함수형 컴포넌트 사용

### 컴포넌트 구조

```
components/
├── ComponentName.jsx    # 컴포넌트 로직
└── ComponentName.css    # 스타일시트
```

## 브랜치 전략

- `main`: 프로덕션 배포용 브랜치
- `dashboard`: 대시보드 개발 브랜치
- `result`: 결과 페이지 개발 브랜치

---

## 문제 해결

### CORS 에러

개발 환경에서 CORS 에러가 발생하는 경우, Vite 프록시 설정을 확인하세요.

`dashboard/vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://x-thon(example).com',
      changeOrigin: true,
    },
  },
}
```
