# 마이링크 (My Link) - PRD (기능 정의서)

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 마이링크 (My Link) |
| **목적** | 개인 또는 크리에이터가 여러 링크를 하나의 페이지에 모아 공유할 수 있는 링크-인-바이오 서비스 |
| **대상 사용자** | 개발자, 크리에이터 |
| **핵심 가치** | 가입 후 1분 안에 나만의 링크 페이지를 만들고 공유할 수 있다 |

---

## 2. 핵심 기능 목록

### 필수 (MVP)

| # | 기능 | 설명 |
|---|------|------|
| F-01 | 소셜 로그인 | Google 소셜 로그인 (Firebase Auth) |
| F-02 | 프로필 설정 | username, displayName, 소개글 (수정 가능) |
| F-03 | 링크 CRUD | 링크 추가 / 인라인 수정 / 삭제 |
| F-04 | 공개 페이지 | `/{displayName}` 형태의 공개 프로필 페이지 |
| F-05 | 반응형 디자인 | 모바일 / 태블릿 / 데스크톱 대응 |

### 선택 (확장)

| # | 기능 | 설명 |
|---|------|------|
| F-06 | 소셜 아이콘 | Instagram, YouTube 등 SNS 아이콘 바로가기 |
| F-07 | 클릭 조회수 | 링크별 클릭 수 추적 (추후 구현 예정) |

---

## 3. 기능 상세 설명

### F-01. 소셜 로그인

- **방식**: Google 소셜 로그인 (Firebase Authentication)
- **신규 가입 시**: Google 계정 연동 후 username 설정
- **displayName 초기값**: Gmail 주소의 `@` 앞부분 자동 세팅 (예: `user123@gmail.com` → `user123`)
- **프로필 초기값**: Google 계정의 이름(username), 프로필 이미지 자동 세팅

### F-02. 프로필 설정

- **username**: 실제 사용자 이름 표시용 / 수정 가능
- **displayName**: Gmail `@` 앞부분으로 자동 설정 / URL 슬러그로 사용 / 중복 불가 / 수정 가능
- **소개글**: 최대 150자, 수정 가능
- **프로필 이미지**: Google 계정 이미지 사용 (별도 업로드 없음)

### F-03. 링크 CRUD

- **추가**: 제목 + URL 입력
- **수정**: 제목, URL 인라인 편집
- **삭제**: 확인 다이얼로그 후 삭제
- **아이콘**: Google Favicon API로 해당 링크의 파비콘 자동 표시 (`https://www.google.com/s2/favicons?domain=...`)
- **제한**: 최대 20개 링크

### F-04. 공개 페이지

- **URL**: `/{displayName}`
- **구성**: 프로필 이미지 → username → 소개글 → 링크 버튼 목록 (파비콘 포함)
- **로딩 속도**: 초기 로드 1초 이내 목표
- 비로그인 상태에서 접근 가능

### F-05. 반응형 디자인

- 모바일 퍼스트 설계
- 브레이크포인트: 모바일(~480px), 태블릿(~768px), 데스크톱(769px~)
- 관리 화면과 공개 페이지 모두 반응형

---

### F-06. 소셜 아이콘 (선택)

- 지원 플랫폼: Instagram, YouTube, X(Twitter), TikTok, GitHub, Email
- 프로필 영역 하단에 아이콘 형태로 표시
- URL만 입력하면 플랫폼 자동 감지

### F-07. 클릭 조회수 (선택 — 추후 구현)

- 링크별 클릭 수 추적
- 추후 구현 예정

---

## 4. 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js (App Router) |
| UI 컴포넌트 | shadcn/ui |
| 스타일링 | Tailwind CSS |
| 인증 | Firebase Authentication (Google 소셜 로그인) |
| DB | Firebase Firestore (서브 컬렉션 구조) |
| 파비콘 | Google Favicon API |
| 배포 | Vercel |

---

## 5. 데이터 모델 (Firestore)

```
users/{uid}
├── username: string (실제 사용자 이름 표시용)
├── displayName: string (Gmail @ 앞부분 자동 설정, URL 슬러그로 사용, 고유)
├── bio: string
├── photoURL: string (Google 계정 이미지)
├── createdAt: timestamp
│
└── links/{linkId}  (서브 컬렉션)
    ├── title: string
    ├── url: string
    └── createdAt: timestamp
```

---

## 6. 페이지 구조

```
/ .......................... 랜딩 페이지
/login ..................... 로그인 (Google 소셜 로그인)
/setup ..................... 신규 가입 시 username, displayName 설정
/admin ..................... 관리 대시보드 (링크 편집, 프로필 수정)
/{displayName} ............. 공개 프로필 페이지
```
