# Portfolio Website (NAM-IL)

이 프로젝트는 **남일(NAM-IL)** 님의 포트폴리오 웹사이트입니다.  
HTML5, CSS3, Modern JavaScript를 기반으로 구현되었으며, 반응형 웹 디자인과 다국어(한국어/영어) 기능을 지원합니다. GitHub Pages를 통해 호스팅되고 있습니다.

---

## 🛠 Tech Stack

### Core
- **HTML5 & CSS3**: 시맨틱 마크업 및 반응형 레이아웃 구현 (Flexbox/Grid 활용)
- **JavaScript (ES6+)**: 별도의 UI 프레임워크 없이 Vanilla JS로 핵심 로직 구현

### Libraries & APIs
- **jQuery**: DOM 조작 및 이벤트 처리 보조
- **D3.js (v4)**: 데이터 시각화 및 인터랙티브 요소 구현 가능성
- **Intersection Observer API**: 이미지 Lazy Loading 및 스크롤 기반 애니메이션 구현
- **Web Speech API**: 텍스트 음성 변환 (TTS) 기능 구현
- **Google Fonts**: 'Noto Sans KR', 'Roboto' 폰트 사용

---

## 📂 Project Structure

프로젝트의 전체적인 디렉토리 구조는 다음과 같습니다. 정적 웹사이트 호스팅에 최적화된 단순하고 직관적인 구조를 따릅니다.

```
d:\_Workspace_Flutter\github_io
├── css/              # 스타일시트 디렉토리
│   └── style.css     # 메인 스타일시트
├── js/               # 자바스크립트 로직 디렉토리
│   └── app.js        # 핵심 로직 (i18n, UI 인터랙션, 이벤트 핸들링 등)
├── locales/          # 다국어 지원을 위한 리소스 파일
│   ├── ko.json       # 한국어 번역 데이터
│   └── en.json       # 영어 번역 데이터
├── img/              # 웹사이트 내 사용되는 이미지 에셋
├── doc/              # 문서 및 프로필 관련 파일 디렉토리
└── index.html        # 메인 진입점 (Single Page Layout)
```

---

## 🏗 Architecture & Key Features

### 1. Internationalization (Custom i18n)
이 프로젝트는 외부 라이브러리 없이 자체적인 경량 i18n 시스템을 구축하여 다국어를 지원합니다.
- **Resource Loading**: `fetch` API를 사용하여 `locales/*.json` 파일을 비동기적으로 로드합니다.
- **Dynamic Binding**:
    - `data-i18n="key"`: 텍스트 콘텐츠 교체
    - `data-i18n-html="key"`: HTML 구조가 포함된 콘텐츠 교체
    - `data-i18n-attr="attr:key"`: `placeholder`, `aria-label` 등 속성 값 교체
- **Persistence**: `localStorage`를 활용하여 사용자가 선택한 언어 설정을 브라우저에 저장하고 유지합니다.

### 2. Performance Optimization
사용자 경험(UX)과 성능을 고려한 최적화 기법이 적용되었습니다.
- **Lazy Loading**: `IntersectionObserver`를 활용하여 스크롤 위치에 따라 이미지를 지연 로딩함으로써 초기 페이지 로드 속도를 개선했습니다.
- **Event Optimization**: 스크롤 이벤트 리스너에 `requestAnimationFrame` 또는 스로틀링과 유사한 로직을 적용하여 렌더링 성능을 최적화했습니다.

### 3. Interactive UI Components
- **Single Page Navigation**: 부드러운 스크롤(Smooth Scroll) 기능을 통해 섹션 간 매끄러운 이동을 제공합니다.
- **Dynamic Modal**: 프로젝트 상세 정보 및 경력 기술서를 모달 형태로 동적으로 렌더링합니다.
- **Scroll Animations**: 스크롤 진행에 따라 스킬 바(Skill Bar)가 채워지거나 통계 숫자가 카운팅되는 인터랙티브 효과를 제공합니다.
- **Accessibility (TTS)**: 자기소개 텍스트를 음성으로 읽어주는 TTS 제어(재생/일시정지/정지/속도조절) UI를 제공합니다.

---

## 🚀 How to Run

이 프로젝트는 정적(Static) 파일로 구성되어 있어 별도의 빌드 프로세스가 필요하지 않습니다.

1. **Clone Repository**
   ```bash
   git clone https://github.com/NAM-IL/nam-il.github.io.git
   ```

2. **Run Locally**
   - **VS Code Live Server**: VS Code 확장 프로그램인 'Live Server'를 설치 후 `index.html`에서 "Open with Live Server"를 실행합니다.
   - **Simple HTTP Server (Python)**:
     ```bash
     # Python 3.x
     python -m http.server 8000
     ```
   - **Direct Open**: 브라우저에서 `index.html` 파일을 직접 열어도 실행 가능하지만, CORS 정책으로 인해 로컬 JSON 파일 로드(i18n 기능)가 제한될 수 있으므로 **로컬 서버 환경에서 실행하는 것을 권장**합니다.
