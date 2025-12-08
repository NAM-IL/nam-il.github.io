# Productivity Hub - 프로젝트 구조 상세 문서

> **버전**: 1.0.0  
> **최종 업데이트**: 2025년 12월 4일  
> **프레임워크**: Flutter 3.x (Dart SDK >=3.0.0 <4.0.0)

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [디렉토리 구조](#3-디렉토리-구조)
4. [아키텍처 패턴](#4-아키텍처-패턴)
5. [핵심 모듈 설명](#5-핵심-모듈-설명)
6. [데이터 흐름](#6-데이터-흐름)
7. [외부 API 연동](#7-외부-api-연동)
8. [데이터베이스 스키마](#8-데이터베이스-스키마)
9. [플랫폼 지원](#9-플랫폼-지원)
10. [향후 개선 사항](#10-향후-개선-사항)

---

## 1. 프로젝트 개요

**Productivity Hub**는 Flutter 기반의 통합 생산성 앱으로, 다음과 같은 핵심 기능을 제공합니다:

| 기능 | 설명 |
|------|------|
| 📝 **할 일 관리 (Todo)** | 할 일 추가/수정/삭제, 완료 상태 토글 |
| 💡 **아이디어 기록** | 카테고리별 아이디어 관리 |
| 📚 **독서 카드** | 독서 진행 관리, 키워드/요약 기록 |
| 🌤️ **날씨 정보** | 현재 위치 및 도시별 날씨 조회 |
| 📰 **뉴스 피드** | AI/양자컴퓨팅 관련 최신 뉴스 |

### 주요 특징
- ✅ **완전 무료** - 모든 API가 무료이며 API 키 설정 불필요
- ✅ **크로스 플랫폼** - Android, iOS, Web, Windows 지원
- ✅ **오프라인 지원** - 로컬 데이터베이스를 통한 오프라인 데이터 저장
- ✅ **Material Design 3** - 최신 디자인 시스템 적용

---

## 2. 기술 스택

### 핵심 프레임워크
```yaml
Flutter: 3.x
Dart SDK: >=3.0.0 <4.0.0
```

### 의존성 패키지

#### 상태 관리
| 패키지 | 버전 | 용도 |
|--------|------|------|
| `provider` | ^6.1.1 | 상태 관리 (ChangeNotifier 기반) |

#### 데이터 저장
| 패키지 | 버전 | 용도 |
|--------|------|------|
| `sqflite` | ^2.3.0 | SQLite 로컬 데이터베이스 (Mobile) |
| `path` | ^1.8.3 | 파일 경로 처리 |
| `shared_preferences` | ^2.2.2 | 키-값 저장소 (Web 폴백) |

#### 네트워크
| 패키지 | 버전 | 용도 |
|--------|------|------|
| `http` | ^1.1.0 | HTTP 요청 |
| `dio` | ^5.4.0 | 고급 HTTP 클라이언트 |

#### 유틸리티
| 패키지 | 버전 | 용도 |
|--------|------|------|
| `intl` | ^0.20.2 | 날짜/시간 포맷팅, 국제화 |
| `geolocator` | ^13.0.1 | 위치 서비스 |
| `permission_handler` | ^12.0.1 | 권한 관리 |
| `url_launcher` | ^6.2.2 | URL 실행 |
| `xml` | ^6.4.2 | RSS 피드 XML 파싱 |
| `cached_network_image` | ^3.3.1 | 이미지 캐싱 |
| `flutter_tts` | ^4.0.2 | Text-to-Speech |

---

## 3. 디렉토리 구조

```
productivity_hub/
├── 📁 lib/                          # 소스 코드 루트
│   ├── 📄 main.dart                 # 앱 진입점
│   │
│   ├── 📁 database/                 # 데이터베이스 계층
│   │   └── 📄 database_helper.dart  # DB 헬퍼 (싱글톤)
│   │
│   ├── 📁 models/                   # 데이터 모델
│   │   ├── 📄 todo_model.dart       # 할 일 모델
│   │   ├── 📄 idea_model.dart       # 아이디어 모델
│   │   ├── 📄 reading_card_model.dart # 독서 카드 모델
│   │   ├── 📄 weather_model.dart    # 날씨 모델
│   │   └── 📄 news_model.dart       # 뉴스 모델
│   │
│   ├── 📁 providers/                # 상태 관리 (Provider)
│   │   ├── 📄 todo_provider.dart    # 할 일 상태 관리
│   │   ├── 📄 idea_provider.dart    # 아이디어 상태 관리
│   │   ├── 📄 reading_card_provider.dart # 독서 카드 상태 관리
│   │   ├── 📄 weather_provider.dart # 날씨 상태 관리
│   │   └── 📄 news_provider.dart    # 뉴스 상태 관리
│   │
│   └── 📁 screens/                  # UI 화면
│       ├── 📄 home_screen.dart      # 메인 화면 (탭 네비게이션)
│       ├── 📄 todo_screen.dart      # 할 일 화면
│       ├── 📄 idea_screen.dart      # 아이디어 화면
│       ├── 📄 reading_card_screen.dart # 독서 카드 화면
│       ├── 📄 weather_screen.dart   # 날씨 화면
│       ├── 📄 news_screen.dart      # 뉴스 목록 화면
│       └── 📄 news_detail_screen.dart # 뉴스 상세 화면
│
├── 📁 android/                      # Android 플랫폼
├── 📁 ios/                          # iOS 플랫폼
├── 📁 web/                          # Web 플랫폼
├── 📁 windows/                      # Windows 플랫폼
├── 📁 build/                        # 빌드 출력
│
├── 📄 pubspec.yaml                  # 프로젝트 설정 & 의존성
├── 📄 analysis_options.yaml         # Dart 분석 옵션
├── 📄 README.md                     # 프로젝트 README
└── 📁 docs/                         # 문서 디렉토리
    └── 📄 PROJECT_STRUCTURE_DETAILED.md  # 본 문서
```

---

## 4. 아키텍처 패턴

### Provider 패턴 (MVVM 기반)

```
┌─────────────────────────────────────────────────────────────┐
│                         UI Layer                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Screens (Views)                         │   │
│  │  HomeScreen → TodoScreen, IdeaScreen, WeatherScreen  │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │ Consumer<Provider>                │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │              Providers (ViewModels)                  │   │
│  │  TodoProvider, IdeaProvider, WeatherProvider, etc.   │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                         ▼                                    │
│                    Data Layer                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Models (Data Classes)                   │   │
│  │  Todo, Idea, ReadingCard, Weather, NewsArticle       │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │              Data Sources                            │   │
│  │  DatabaseHelper (SQLite/SharedPreferences)           │   │
│  │  HTTP APIs (Open-Meteo, RSS Feeds)                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 앱 초기화 흐름

```dart
// main.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 1. 한국어 로케일 초기화
  await initializeDateFormatting('ko', null);
  
  // 2. 데이터베이스 초기화 (플랫폼별 자동 처리)
  await DatabaseHelper.instance.initialize();
  
  // 3. 앱 실행
  runApp(const MyApp());
}
```

### MultiProvider 구성

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => TodoProvider()),
    ChangeNotifierProvider(create: (_) => IdeaProvider()),
    ChangeNotifierProvider(create: (_) => ReadingCardProvider()),
    ChangeNotifierProvider(create: (_) => WeatherProvider()),
    ChangeNotifierProvider(create: (_) => NewsProvider()),
  ],
  child: MaterialApp(...),
)
```

---

## 5. 핵심 모듈 설명

### 5.1 Models (데이터 모델)

#### Todo 모델
```dart
class Todo {
  final int? id;
  final String title;
  final String? description;
  final bool isCompleted;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? completedAt;
  
  // toMap(), fromMap(), copyWith() 메서드 포함
}
```

#### Idea 모델
```dart
class Idea {
  final int? id;
  final String title;
  final String? content;
  final String? category;  // 기술, 비즈니스, 디자인, 기타
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

#### ReadingCard 모델
```dart
enum ReadingStatus { inProgress, completed, paused }

class ReadingCard {
  final int? id;
  final String title;           // 도서명
  final String author;          // 저자
  final int totalPages;         // 페이지 수
  final DateTime startDate;     // 시작일
  final DateTime targetEndDate; // 목표 종료일
  final DateTime? actualEndDate;// 실제 완료일
  final List<String> keywords;  // 핵심 키워드 5개
  final String? summary;        // 단문 요약
  final ReadingStatus status;   // 상태
}
```

#### Weather 모델
```dart
class Weather {
  final String city;
  final double temperature;
  final String description;
  final String icon;           // 이모지 아이콘
  final double? humidity;
  final double? windSpeed;
  final List<HourlyWeather> hourlyForecast;  // 24시간 예보
  final List<DailyWeather> dailyForecast;    // 7일 예보
  
  // WMO 날씨 코드를 한글 설명/이모지로 변환
  static String _getWeatherDescription(int code);
  static String _getWeatherIcon(int code);
}
```

#### NewsArticle 모델
```dart
enum NewsCategory { all, ai, quantumComputing }

class NewsArticle {
  final String title;
  final String? description;
  final String? url;
  final String? urlToImage;
  final String? publishedAt;
  final String? source;
  final NewsCategory category;
}
```

### 5.2 Providers (상태 관리)

#### 공통 패턴
모든 Provider는 다음 패턴을 따릅니다:

```dart
class XxxProvider with ChangeNotifier {
  List<Xxx> _items = [];
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Xxx> get items => _items;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // CRUD Operations
  Future<void> loadItems() async { ... }
  Future<void> addItem(Xxx item) async { ... }
  Future<void> updateItem(Xxx item) async { ... }
  Future<void> deleteItem(int id) async { ... }
}
```

#### TodoProvider 특수 기능
```dart
Future<void> toggleTodo(int id) async {
  // 완료 상태 토글 + completedAt 타임스탬프 설정
}
```

#### ReadingCardProvider 특수 기능
```dart
Future<void> completeCard(int id) async {
  // 상태를 completed로 변경 + actualEndDate 설정
}

Future<void> pauseCard(int id) async {
  // 상태를 paused로 변경
}
```

#### WeatherProvider 특수 기능
```dart
// 도시 이름으로 날씨 조회 (Geocoding → Weather API)
Future<void> fetchWeatherByCity(String city) async;

// 좌표로 날씨 조회 (현재 위치용)
Future<void> fetchWeatherByLocation(double lat, double lon) async;
```

#### NewsProvider 특수 기능
```dart
// 카테고리 필터링
NewsCategory _selectedCategory = NewsCategory.all;
List<NewsArticle> get filteredArticles { ... }

// 다중 RSS 피드 파싱
Future<void> fetchNews() async;
List<NewsArticle> _parseRssFeed(String xmlString, ...);
```

### 5.3 Screens (UI 화면)

#### HomeScreen - 메인 네비게이션
```dart
class HomeScreen extends StatefulWidget {
  // NavigationBar를 통한 5개 탭 관리
  // - 할 일 (TodoScreen)
  // - 아이디어 (IdeaScreen)
  // - 독서 카드 (ReadingCardScreen)
  // - 날씨 (WeatherScreen)
  // - 뉴스 (NewsScreen)
}
```

#### 공통 UI 패턴
- `Consumer<Provider>`: 상태 변화 감지 및 UI 갱신
- `CircularProgressIndicator`: 로딩 상태 표시
- `Dismissible`: 스와이프 삭제
- `AlertDialog`: 추가/수정/삭제 다이얼로그

---

## 6. 데이터 흐름

### 6.1 로컬 데이터 (Todo, Idea, ReadingCard)

```
┌─────────┐    추가/수정/삭제    ┌──────────────┐
│ Screen  │ ──────────────────► │   Provider   │
└────┬────┘                     └──────┬───────┘
     │                                 │
     │ Consumer                        │ DatabaseHelper
     │                                 ▼
     │                          ┌──────────────┐
     └◄─────────────────────────│   Database   │
          notifyListeners()     │ SQLite/Prefs │
                                └──────────────┘
```

### 6.2 원격 데이터 (Weather, News)

```
┌─────────┐    fetchWeather()   ┌──────────────┐
│ Screen  │ ──────────────────► │   Provider   │
└────┬────┘                     └──────┬───────┘
     │                                 │
     │ Consumer                        │ HTTP GET
     │                                 ▼
     │                          ┌──────────────┐
     └◄─────────────────────────│  External    │
          notifyListeners()     │    API       │
                                └──────────────┘
```

---

## 7. 외부 API 연동

### 7.1 날씨 API (Open-Meteo)

**완전 무료, API 키 불필요**

| API | URL | 용도 |
|-----|-----|------|
| Geocoding | `geocoding-api.open-meteo.com/v1/search` | 도시명 → 좌표 변환 |
| Weather | `api.open-meteo.com/v1/forecast` | 날씨 정보 조회 |

#### 요청 예시
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=37.5665
  &longitude=126.9780
  &current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m
  &hourly=temperature_2m,weather_code
  &daily=temperature_2m_max,temperature_2m_min,weather_code
  &timezone=Asia/Seoul
  &forecast_days=7
```

### 7.2 뉴스 API (RSS 피드)

**완전 무료, API 키 불필요**

| 소스 | 카테고리 | 특징 |
|------|----------|------|
| Google News RSS | AI, Quantum Computing | 최신 뉴스 |
| Reddit RSS | r/QuantumComputing, r/artificial, r/MachineLearning | 커뮤니티 |
| ArXiv RSS | cs.AI, quant-ph | 학술 논문 |

#### CORS 처리 (Web)
```dart
// 웹에서는 CORS 프록시 사용
const corsProxy = 'https://api.allorigins.win/raw?url=';
final url = '$corsProxy$originalUrl';
```

---

## 8. 데이터베이스 스키마

### DatabaseHelper (싱글톤 패턴)

```dart
class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;
  static SharedPreferences? _prefs;
  
  // 플랫폼별 자동 처리
  // - Mobile: SQLite (sqflite)
  // - Web: SharedPreferences (JSON)
}
```

### SQLite 테이블 스키마

#### todos 테이블
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  is_completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);
```

#### ideas 테이블
```sql
CREATE TABLE ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

#### reading_cards 테이블
```sql
CREATE TABLE reading_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  total_pages INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  target_end_date TEXT NOT NULL,
  actual_end_date TEXT,
  keywords TEXT,           -- 쉼표로 구분된 키워드
  summary TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inProgress'
);
```

### 마이그레이션 히스토리

| 버전 | 변경 사항 |
|------|-----------|
| v1 | 초기 스키마 (todos, ideas) |
| v2 | todos에 updated_at 컬럼 추가 |
| v3 | reading_cards 테이블 추가 |

---

## 9. 플랫폼 지원

### 지원 플랫폼

| 플랫폼 | 상태 | 비고 |
|--------|------|------|
| 🤖 Android | ✅ 지원 | SQLite, 위치 서비스 완전 지원 |
| 🍎 iOS | ✅ 지원 | SQLite, 위치 서비스 완전 지원 |
| 🌐 Web | ✅ 지원 | SharedPreferences 폴백, 위치 서비스 제한 |
| 🪟 Windows | ✅ 지원 | SQLite 지원 |

### 플랫폼별 특이사항

#### Web 제한 사항
- SQLite 미지원 → SharedPreferences (JSON) 폴백
- 위치 서비스 제한적 → 도시 이름 검색 권장
- RSS 피드 접근 시 CORS 프록시 필요

#### Android 권한
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

---

## 10. 향후 개선 사항

### 기능 추가
- [ ] 📱 할 일 알림 기능 (Local Notifications)
- [ ] 🔍 아이디어 검색 기능
- [ ] 📊 날씨 예보 그래프
- [ ] ⭐ 뉴스 즐겨찾기
- [ ] 🌙 다크 모드 지원
- [ ] ☁️ 데이터 백업/복원 (Cloud Sync)

### 기술 개선
- [ ] 테스트 코드 추가 (Unit, Widget, Integration)
- [ ] 코드 분석 (code coverage)
- [ ] CI/CD 파이프라인 구축
- [ ] 성능 최적화 (메모리, 렌더링)

### 코드 품질
- [ ] Freezed 패키지로 immutable 모델 리팩토링
- [ ] Repository 패턴 도입
- [ ] Use Case 계층 추가 (Clean Architecture)

---

## 📚 참고 자료

- [Flutter 공식 문서](https://flutter.dev/docs)
- [Provider 패키지](https://pub.dev/packages/provider)
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [Material Design 3](https://m3.material.io/)

---

<div align="center">

**Productivity Hub** - 통합 생산성 앱

Made with ❤️ using Flutter

</div>

