# 마이링크 (MyLink)

여러 링크를 한 페이지에 모아 **URL 하나로 공유**하는 링크-인-바이오 서비스입니다.

🚀 **Live Demo**: https://my-link-kappa-ivory.vercel.app

## 주요 기능

- 🔐 **Google 소셜 로그인** (Firebase Authentication)
- 👤 **프로필 설정** — 표시 이름, 공개 주소(username), 소개글
- 🔗 **링크 CRUD** — 추가 / 인라인 수정 / 삭제 (Firestore 영구 저장)
- 🌐 **개인 공개 페이지** — `/{username}` 로 누구나 접속
- 📊 **클릭 통계** — 링크별 클릭 수 집계 (동시 클릭에도 안전한 서버 increment)
- 🖼️ **동적 OG 이미지** — SNS 공유 시 미리보기 자동 생성 (@vercel/og)
- 📱 **반응형 디자인** — 모바일 / 데스크톱
- 🛡️ **보안 규칙** — 읽기는 누구나, 쓰기는 본인만 (Firestore Security Rules)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) + TypeScript |
| 스타일링 | Tailwind CSS + shadcn/ui |
| 인증 | Firebase Authentication (Google) |
| 데이터베이스 | Firebase Firestore |
| 배포 | Vercel |

## 페이지 구조

| 경로 | 설명 | 접근 |
|------|------|------|
| `/` | 랜딩 페이지 | 누구나 |
| `/mypage` | 링크·프로필 관리 + 통계 | 로그인 |
| `/{username}` | 공개 프로필 페이지 | 누구나 |

## 데이터 구조 (Firestore)

```
users/{uid}                 // 프로필: username, displayName, bio, photoURL
  └ links/{linkId}          // 링크: title, url, icon, clickCount
```

## 로컬 실행

```bash
npm install
npm run dev          # http://localhost:3000
```

`.env.local`에 Firebase 설정이 필요합니다:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
