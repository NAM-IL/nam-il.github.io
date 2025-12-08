# Miracle Reading System - 포트폴리오

## 📚 프로젝트 개요

**Miracle Reading System**은 독서 습관 형성과 도서 관리를 위한 종합적인 웹 애플리케이션입니다. AI 기반 도서 요약, 독서 계획 관리, 속독 훈련, 소셜 기능 등을 제공하는 풀스택 독서 플랫폼입니다.

### 프로젝트 기간
- 개발 기간: 2024년 (진행 중)
- 개발 형태: 개인 프로젝트

### 프로젝트 목표
- 독서 습관 형성을 위한 체계적인 관리 시스템 구축
- AI 기술을 활용한 도서 요약 및 추천 기능 제공
- 사용자 경험을 고려한 직관적인 UI/UX 구현
- 확장 가능한 아키텍처 설계

---

## 🎯 구현된 주요 기능

### 1. 사용자 인증 및 관리 시스템

#### 인증 방식
- **폼 기반 로그인**: BCrypt 비밀번호 암호화, 세션 기반 인증
- **Google OAuth2**: Google 계정을 통한 소셜 로그인
- **Kakao OAuth2**: Kakao 계정을 통한 소셜 로그인
- **OAuth2 프로필 완성도 체크**: 소셜 로그인 시 추가 정보 입력 유도

#### 회원 관리 기능
- **회원 가입**: 
  - 로그인 ID, 이메일 중복 체크 (AJAX 실시간 검증)
  - 개인정보 입력 (이름, 전화번호, 성별, 출생년도, 지역, 관심분야)
  - OAuth 사용자 추가 정보 입력 지원
- **프로필 관리**:
  - 프로필 이미지 업로드 (최대 5MB, 이미지 파일만 허용)
  - 개인정보 수정 (이름, 전화번호, 출생년도, 지역, 관심분야)
  - 비밀번호 변경 (현재 비밀번호 확인 필요)
- **회원 탈퇴**: 
  - 탈퇴 회원 정보를 `DeletedUser` 테이블로 백업
  - 관련 데이터 정리

#### 세션 관리
- 동시 접속 제어 (최대 1개 세션)
- 관리자 전용 세션 분리 (`ADMIN_SESSION`)
- 자동 로그아웃 및 쿠키 관리

---

### 2. 도서 관리 시스템

#### 도서 등록
- **알라딘 Open API 연동**:
  - ISBN 기반 도서 정보 자동 수집
  - 제목, 저자, 출판사, 출판일, 페이지 수, 표지 이미지, 설명 등 자동 입력
  - 카테고리 정보 저장
- **일괄 도서 등록**:
  - 마크다운 파일 기반 ISBN 리스트 파싱
  - 여러 도서를 한 번에 등록
  - 성공/실패 통계 제공

#### 도서 조회 및 관리
- **도서 목록**: 페이징 처리 (페이지당 6권)
- **도서 상세 조회**: AJAX 기반 상세 정보 조회
- **도서 검색**: 제목, 저자, ISBN 기반 검색 (구현 예정)

---

### 3. AI 기반 도서 요약 시스템

#### AI 요약 생성
- **Ollama 로컬 LLM 연동**:
  - Qwen3:1.7b 모델 사용
  - Spring AI 프레임워크 통합
  - 웹 검색을 통한 도서 정보 보강
- **요약 타입**:
  - 전체 요약 (Total Summary): 사용자 직접 작성
  - 간단 요약 (Short Summary): 전체 요약을 AI로 요약
  - 간략 요약 (Brief Summary): 사용자 직접 작성
  - AI 요약 (AI Summary): Ollama를 통한 자동 생성
- **동시 요청 방지**:
  - `ConcurrentHashMap`을 활용한 동시 실행 방지
  - 동일 도서에 대한 중복 요청 차단

#### 요약 관리
- **키워드 저장**: 최대 10개의 키워드 저장
- **질문 저장**: 최대 10개의 질문 저장
- **마인드맵 데이터**: JSON 형식의 마인드맵 데이터 저장
- **공개/비공개 설정**: 요약 공개 여부 설정 (`publicYn`)

#### AI 챗봇
- 도서 관련 질의응답 기능
- REST API 기반 실시간 대화

---

### 4. 독서 계획 및 기록 관리

#### 독서 계획
- **목표 설정**:
  - 주간 독서 목표 (권수)
  - 월간 독서 목표 (권수)
  - 년간 독서 목표 (권수)
- **달성률 계산**: 주/월/년간 목표 대비 달성률 자동 계산

#### 독서 스케줄 (미션)
- **스케줄 생성**:
  - 도서 선택
  - 시작일/종료일 설정
  - 일일 목표 페이지 수 설정
- **스케줄 관리**:
  - 스케줄 수정 (시작일, 종료일, 일일 페이지 수)
  - 스케줄 삭제
  - 스케줄 완료 처리
- **스케줄 상태 관리**:
  - 성공 (SUCCESS): 기한 내 완료
  - 지연 완료 (DELAYED): 기한 초과 후 완료
  - 실패 (FAILED): 기한 초과 미완료
  - 진행중 (IN_PROGRESS): 진행 중

#### 독서 기록
- **일별 페이지 기록**:
  - 날짜별 독서 페이지 수 기록
  - AJAX 기반 실시간 저장
  - 누적 페이지 수 자동 계산
- **기록 관리**:
  - 기록 수정
  - 기록 삭제
  - 미션별 누적 페이지 수 조회

#### 독서 통계
- **내서재 통계**:
  - 총 요약 개수
  - 공개/비공개 요약 개수
  - 평균 요약 길이
  - 가장 많이 읽은 카테고리

---

### 5. 속독 훈련 기능

#### 시각 훈련
- **주변 시야 확장 훈련** (Peripheral Vision Training):
  - 화면 중앙의 텍스트와 주변 요소를 동시에 인식하는 훈련
- **동적 시야 훈련** (Dynamic Vision Training):
  - 움직이는 요소를 추적하는 시야 훈련
- **집중력 향상 훈련** (Concentration Training):
  - 집중력을 향상시키는 훈련

#### 속독 연습
- **속도 조절 가능한 텍스트 읽기**:
  - 읽기 속도 조절 기능
  - 읽기 속도 측정 및 기록

---

### 6. 갤러리 및 소셜 기능

#### 도서 요약 갤러리
- **공개 요약 조회**:
  - 모든 사용자의 공개된 요약 조회
  - 키워드 검색 기능
- **요약 상세 보기**:
  - 요약 내용, 키워드, 질문 조회
  - 작성자 정보 표시
  - 좋아요/찜 개수 표시

#### 소셜 인터랙션
- **좋아요 기능**:
  - 요약에 좋아요 추가/제거
  - 좋아요 개수 실시간 업데이트
- **찜(즐겨찾기) 기능**:
  - 요약을 찜 목록에 추가/제거
  - 내 찜 목록 조회
- **댓글 시스템**:
  - 댓글 작성/수정/삭제
  - 대댓글(ReplySecond) 지원
  - 댓글 개수 표시

#### 통계 기능
- **갤러리 통계**:
  - 인기 요약 통계
  - 좋아요/댓글/찜 개수 집계
- **사용자 활동 통계**:
  - 작성한 요약 개수
  - 받은 좋아요 개수
  - 작성한 댓글 개수

---

### 7. 마인드맵 기능

#### 마인드맵 생성 및 관리
- **마인드맵 데이터 저장**:
  - JSON 형식의 마인드맵 데이터 저장
  - 도서 요약과 연동
- **마인드맵 조회**:
  - 저장된 마인드맵 데이터 조회
  - 요약 ID 기반 마인드맵 조회

---

### 8. 관리자 콘솔

#### 관리자 인증
- **관리자 전용 로그인**: 별도 세션 관리
- **비밀번호 관리**: BCrypt 암호화, 비밀번호 재설정 기능

#### 회원 관리
- **회원 목록 조회**: 전체 회원 목록 조회
- **회원 등록**: 관리자가 직접 회원 등록
- **회원 삭제**: 회원 탈퇴 처리 (이메일 또는 로그인 ID 기반)

#### 도서 관리
- **도서 등록**: 
  - 알라딘 API 연동 도서 등록
  - 수동 도서 정보 입력
- **도서 목록**: 페이징 처리된 도서 목록 조회
- **도서 상세 조회**: AJAX 기반 도서 상세 정보 조회
- **일괄 도서 등록**: ISBN 리스트 파일 기반 일괄 등록

#### 관리자 계정 관리
- **관리자 목록 조회**: 전체 관리자 목록
- **관리자 등록**: 새 관리자 계정 생성
- **관리자 수정**: 이메일/비밀번호 수정
- **관리자 삭제**: 관리자 계정 삭제

---

## 🛠 기술 스택

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.3.5
  - Spring MVC (웹 계층)
  - Spring Security (인증/인가)
  - Spring Data JPA (데이터 접근)
  - Spring AI 1.0.0-M6 (AI 통합)
  - OAuth2 Client (소셜 로그인)
- **Database**: Oracle 23 AI (Oracle 11g 호환)
- **ORM**: Hibernate (JPA)
- **Connection Pool**: HikariCP

### Frontend
- **View Technology**: JSP (JavaServer Pages)
- **UI Framework**: Bootstrap 5
- **JavaScript Library**: jQuery
- **Icons**: Bootstrap Icons

### AI & External APIs
- **AI Framework**: Spring AI (Ollama 통합)
- **LLM Model**: Qwen3:1.7b (로컬 실행)
- **External APIs**:
  - 알라딘 Open API (도서 정보)
  - Google OAuth2 API
  - Kakao OAuth2 API

### Build & Tools
- **Build Tool**: Gradle 8.x
- **Code Generation**: Lombok
- **API Documentation**: Springdoc OpenAPI (Swagger UI)
- **QR Code**: ZXing Library
- **Container**: Docker Compose

### Development Environment
- **IDE**: IntelliJ IDEA / Eclipse
- **Version Control**: Git
- **Logging**: Logback

---

## 🏗 시스템 아키텍처

### 계층 구조
```
┌─────────────────────────────────────┐
│   Presentation Layer (JSP/View)   │
│   - Controller (REST/Web)          │
│   - HomeController                 │
│   - LibraryController              │
│   - GalleryController              │
│   - LibraryApiController           │
│   - AdminController                │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│   Service Layer (Business Logic)   │
│   - UserService                    │
│   - BookService                    │
│   - BookSummaryService             │
│   - AISummaryService               │
│   - PlanService                    │
│   - MissionService                │
│   - ReadingRecordService           │
│   - ReplyService                   │
│   - LikeService                    │
│   - ZzimService                    │
│   - AdminService                   │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│   Repository Layer (Data Access)   │
│   - Spring Data JPA Interfaces     │
│   - UserRepository                 │
│   - BookRepository                 │
│   - BookSummaryRepository          │
│   - PlanRepository                 │
│   - MissionRepository              │
│   - ReadingRecordRepository        │
│   - ReplyRepository                │
│   - LikeRepository                 │
│   - ZzimRepository                 │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│   Database (Oracle 23 AI)         │
└────────────────────────────────────┘
```

### 주요 패키지 구조
```
com.miraclereading/
├── config/          # Spring 설정
│   ├── SecurityConfig.java
│   ├── OAuth2SuccessHandler.java
│   ├── FormLoginSuccessHandler.java
│   ├── WebConfig.java
│   └── SwaggerConfiguration.java
├── controller/      # 컨트롤러
│   ├── HomeController.java
│   ├── LibraryController.java
│   ├── LibraryApiController.java
│   ├── GalleryController.java
│   ├── MindmapApiController.java
│   └── admin/
│       └── AdminController.java
├── entity/          # JPA 엔티티
│   ├── User.java
│   ├── Book.java
│   ├── BookSummary.java
│   ├── Plan.java
│   ├── Mission.java
│   ├── ReadingRecord.java
│   ├── Reply.java
│   ├── ReplySecond.java
│   ├── Like.java
│   ├── Zzim.java
│   └── Admin.java
├── repository/      # Spring Data JPA 리포지토리
│   ├── UserRepository.java
│   ├── BookRepository.java
│   ├── BookSummaryRepository.java
│   └── ...
├── service/         # 비즈니스 로직 서비스
│   ├── UserService.java
│   ├── BookService.java
│   ├── BookSummaryService.java
│   ├── AISummaryService.java
│   ├── PlanService.java
│   ├── MissionService.java
│   └── ...
└── util/            # 유틸리티 클래스
    ├── PasswordHashGenerator.java
    └── GenerateBookInsertSQL.java
```

### 데이터베이스 설계

#### 주요 엔티티
- **사용자 관련**:
  - `User`: 사용자 정보 (로그인 ID, 이메일, 이름, 프로필 이미지 등)
  - `UserAccount`: 사용자 계정 정보 (OAuth 프로바이더 정보)
  - `Member`: 회원 정보 (UserAccount와 연동)
  - `DeletedUser`: 탈퇴 회원 백업
  - `UserStatus`: 사용자 상태 코드 (ACTIVE, DELETED, DORMANT, SUSPENDED)
  - `Gender`: 성별 코드
  - `Region`: 지역 코드

- **도서 관련**:
  - `Book`: 도서 정보 (제목, 저자, 출판사, ISBN, 표지 이미지 등)
  - `BookSummary`: 도서 요약 (전체/간단/간략/AI 요약, 키워드, 질문, 마인드맵)
  - `Publisher`: 출판사 정보
  - `BookField`: 도서 분야

- **독서 관리**:
  - `Plan`: 독서 계획 (주간/월간/년간 목표)
  - `Mission`: 독서 미션 (도서별 독서 스케줄)
  - `ReadingRecord`: 독서 기록 (일별 페이지 수)

- **소셜 기능**:
  - `Reply`: 댓글
  - `ReplySecond`: 대댓글
  - `Like`: 좋아요
  - `Zzim`: 찜(즐겨찾기)

- **관리자**:
  - `Admin`: 관리자 정보

---

## 🔐 보안 기능

### 인증 및 인가
- **비밀번호 암호화**: BCrypt 알고리즘 사용
- **CSRF 보호**: Spring Security 기본 활성화
- **세션 관리**: 
  - 동시 접속 제어 (최대 1개 세션)
  - 관리자 세션 분리
  - 자동 만료 및 쿠키 관리
- **OAuth2**: Google, Kakao 소셜 로그인 지원
- **프로필 미완성 사용자 제어**: OAuth 로그인 시 추가 정보 입력 유도

### 데이터 보호
- **탈퇴 회원 백업**: `DeletedUser` 테이블로 데이터 보존
- **환경 변수 기반 설정**: 민감 정보 분리 (OAuth 키, API 키 등)
- **SQL Injection 방지**: JPA/Hibernate 사용
- **파일 업로드 검증**: 파일 크기 및 타입 검증 (프로필 이미지)

---

## 📊 주요 성과 및 특징

### 기술적 성과
1. **AI 통합**: 
   - Spring AI를 활용한 로컬 LLM 연동
   - 비용 효율적인 AI 기능 구현 (Ollama 로컬 실행)
   - 동시 요청 방지 메커니즘으로 리소스 효율적 관리

2. **확장 가능한 아키텍처**: 
   - 계층형 구조로 유지보수성 및 확장성 확보
   - Service-Repository 패턴으로 비즈니스 로직 분리
   - 인터페이스 기반 설계로 테스트 용이성 확보

3. **다중 인증 시스템**: 
   - 폼 로그인과 OAuth2를 통합한 유연한 인증 시스템
   - OAuth 사용자 프로필 완성도 체크 및 추가 정보 입력 유도

4. **비동기 처리**: 
   - AI 요약 생성 시 동시 요청 방지 및 상태 관리
   - AJAX 기반 실시간 데이터 업데이트

### 사용자 경험
1. **직관적인 UI**: 
   - Bootstrap 5 기반 반응형 디자인
   - 공통 레이아웃 (header, footer) 재사용
   - 모달 기반 알림 및 피드백

2. **효율적인 데이터 로딩**: 
   - 페이징 처리로 대량 데이터 효율적 로딩
   - AJAX 기반 비동기 데이터 처리

3. **실시간 피드백**: 
   - AJAX 기반 실시간 검증 (로그인 ID, 이메일 중복 체크)
   - 실시간 좋아요/댓글 개수 업데이트

4. **모바일 친화적**: 
   - 반응형 레이아웃
   - 모바일 환경 최적화

### 비즈니스 가치
1. **독서 습관 형성**: 
   - 체계적인 계획 및 기록 관리
   - 목표 설정 및 달성률 추적
   - 독서 통계 및 분석

2. **학습 효율 향상**: 
   - AI 요약으로 빠른 도서 이해
   - 키워드 및 질문을 통한 핵심 내용 정리
   - 마인드맵을 통한 시각적 학습

3. **커뮤니티 활성화**: 
   - 갤러리를 통한 요약 공유
   - 좋아요, 찜, 댓글을 통한 소셜 인터랙션
   - 인기 요약 및 통계 제공

---

## 🚀 실행 방법

### 사전 요구사항
- JDK 17 이상
- Gradle 8.x (또는 Gradle Wrapper)
- Oracle Database 23 AI (또는 Docker)
- Ollama (AI 요약 기능 사용 시)

### 환경 설정
1. **데이터베이스 설정**
   ```yaml
   # application.yml
   spring:
     datasource:
       url: jdbc:oracle:thin:@localhost:8521/FREEPDB1
       username: MIRACLE
       password: quantum
   ```

2. **OAuth2 설정** (환경 변수)
   ```bash
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   KAKAO_CLIENT_ID=your-kakao-client-id
   KAKAO_CLIENT_SECRET=your-kakao-client-secret
   ```

3. **알라딘 API 키** (환경 변수)
   ```bash
   ALADIN_TTB_KEY=your-aladin-api-key
   ```

4. **Ollama 설정** (환경 변수, 선택사항)
   ```bash
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=qwen3:1.7b
   ```

### 빌드 및 실행
```bash
# 의존성 설치 및 빌드
./gradlew clean build

# 애플리케이션 실행
./gradlew bootRun
```

### 접속 URL
- 사용자 포털: `http://localhost:3306/`
- 관리자 포털: `http://localhost:3306/admin/login`
- Swagger UI: `http://localhost:3306/swagger-ui.html`

### 초기 계정 정보 (개발용)
- **관리자**: `test1004@gmail.com` / `quantum`
- **일반 사용자**: `testuser` / `testuser`, `user123` / `user123`

---

## 📁 프로젝트 구조

```
MiracleReadingSystem/
├── src/
│   ├── main/
│   │   ├── java/com/miraclereading/
│   │   │   ├── config/          # 설정 클래스
│   │   │   ├── controller/       # 컨트롤러
│   │   │   ├── entity/           # JPA 엔티티
│   │   │   ├── repository/       # 데이터 접근 계층
│   │   │   ├── service/           # 비즈니스 로직
│   │   │   └── util/             # 유틸리티
│   │   ├── resources/
│   │   │   ├── application.yml   # 설정 파일
│   │   │   ├── data.sql          # 초기 데이터
│   │   │   └── static/           # 정적 리소스
│   │   └── webapp/
│   │       └── WEB-INF/views/    # JSP 뷰
│   └── test/                     # 테스트 코드
├── docs/                         # 프로젝트 문서
│   ├── PORTFOLIO.md              # 포트폴리오 문서
│   ├── ARCHITECTURE_OVERVIEW.md  # 아키텍처 개요
│   └── ...
├── build.gradle                  # Gradle 빌드 설정
├── compose.yaml                  # Docker Compose 설정
└── README.md                     # 프로젝트 README
```

---

## 🎨 주요 화면 구성

### 사용자 화면
- **홈** (`/`): 메인 대시보드, 빠른 접근 메뉴
- **로그인** (`/login`): 폼 로그인 및 소셜 로그인
- **회원가입** (`/register`): 회원 가입 폼, OAuth 사용자 추가 정보 입력
- **마이페이지** (`/mypage`): 프로필 조회
- **프로필 수정** (`/mypage/edit`): 프로필 정보 수정, 프로필 이미지 업로드
- **내서재** (`/library`): 
  - 독서 계획 탭: 주/월/년간 목표 설정 및 달성률
  - 독서 스케줄 탭: 독서 스케줄 관리, 일별 페이지 기록
  - 도서 요약 목록 탭: 작성한 요약 목록
  - 찜 목록 탭: 찜한 요약 목록
- **도서 요약** (`/library/summary`): 도서 요약 작성/수정
- **갤러리** (`/gallery`): 공개된 요약 갤러리, 검색 기능
- **속독 훈련** (`/speed-reading`): 속독 연습
- **시각 훈련** (`/training/*`): 주변 시야, 동적 시야, 집중력 훈련

### 관리자 화면
- **관리자 로그인** (`/admin/login`): 별도 인증 시스템
- **회원 관리** (`/admin/member/manage`): 회원 목록, 등록, 삭제
- **도서 관리** (`/admin/book/manage`): 
  - 도서 등록 탭: 알라딘 API 연동 도서 등록
  - 도서 목록 탭: 페이징 처리된 도서 목록
  - 일괄 등록 탭: ISBN 리스트 기반 일괄 등록
- **관리자 계정 관리** (`/admin/list`): 관리자 목록, 등록, 수정, 삭제

---

## 🔄 향후 개선 계획

### 기능 개선
- [ ] 모바일 앱 개발 (Flutter/React Native)
- [ ] 실시간 알림 시스템
- [ ] 독서 추천 알고리즘 개선
- [ ] 벡터 데이터베이스 연동 (Oracle Vector Store)
- [ ] 다국어 지원
- [ ] 도서 검색 기능 강화 (Elasticsearch 통합)

### 기술 개선
- [ ] 마이크로서비스 아키텍처 전환 검토
- [ ] Redis 캐싱 도입
- [ ] Elasticsearch 검색 엔진 통합
- [ ] CI/CD 파이프라인 구축
- [ ] 단위 테스트 및 통합 테스트 확대
- [ ] API 문서화 강화 (Swagger)

### 성능 최적화
- [ ] 데이터베이스 쿼리 최적화
- [ ] 이미지 최적화 및 CDN 연동
- [ ] 프론트엔드 번들 최적화
- [ ] API 응답 시간 개선
- [ ] AI 요약 생성 성능 개선

---

## 📝 개발 이슈 및 해결 과정

### 주요 도전 과제
1. **AI 요약 생성 비동기 처리**
   - 문제: 동시 요청 시 중복 생성 및 리소스 낭비
   - 해결: `ConcurrentHashMap`을 활용한 동시 실행 방지 메커니즘 구현
   - 결과: 동일 도서에 대한 중복 요청 차단, 리소스 효율적 관리

2. **OAuth2 프로필 미완성 사용자 처리**
   - 문제: 소셜 로그인 시 추가 정보 입력 필요
   - 해결: `OAuth2SuccessHandler`에서 프로필 완성도 체크 및 세션 제어
   - 결과: OAuth 사용자도 추가 정보 입력 후 서비스 이용 가능

3. **Oracle 23 AI 호환성**
   - 문제: 최신 Oracle 버전과의 호환성 이슈
   - 해결: 적절한 JDBC 드라이버 버전 및 설정 적용
   - 결과: Oracle 23 AI와 정상 연동

4. **세션 관리 및 동시 접속 제어**
   - 문제: 다중 세션 관리의 복잡성
   - 해결: Spring Security 세션 관리 기능 활용
   - 결과: 사용자당 1개 세션 제한, 관리자 세션 분리

5. **일괄 도서 등록 기능**
   - 문제: 마크다운 파일에서 ISBN 리스트 파싱
   - 해결: 정규표현식을 활용한 파싱 로직 구현
   - 결과: 마크다운 파일 기반 일괄 도서 등록 가능

---

## 📚 참고 문서

- [아키텍처 개요](./ARCHITECTURE_OVERVIEW.md)
- [프로젝트 구조](./PROJECT_STRUCTURE.md)
- [환경 설정 가이드](./ENV_SETUP.md)
- [GPU 설정 가이드](./GPU_SETUP.md)
- [CPU 최적화](./CPU_OPTIMIZATION.md)
- [Kakao 보안 설정](./KAKAO_SECURITY.md)

---

## 👨‍💻 개발자 정보

- **프로젝트명**: Miracle Reading System
- **개발 환경**: Windows 10, Java 17, Spring Boot 3.3.5
- **데이터베이스**: Oracle 23 AI
- **버전 관리**: Git

---

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 프로젝트입니다.

---

## 🙏 감사의 말

- Spring Boot 커뮤니티
- Oracle Database
- 알라딘 Open API
- Ollama 프로젝트

---

**마지막 업데이트**: 2025년 1월
