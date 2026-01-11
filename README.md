# All Influencer Frontend (Next.js)

이 저장소는 All Influencer 프론트엔드(Next.js 14) 프로젝트입니다.

## 로컬 개발 환경 세팅

### 필요 조건
- Node.js: v20 이상 권장 (프로젝트 실행 확인: v20.11.1)
- npm: `package-lock.json` 기반으로 설치합니다.
- 백엔드(API): 기본 `http://localhost:8080`

### 1) 환경변수 파일 준비
이 프로젝트는 `env.local` 파일을 사용합니다. (Docker 실행 시에도 `docker-compose.yml`에서 이 파일을 사용)

> `env.local`은 `.gitignore`에 포함되어 **커밋하지 않습니다.** 로컬에서 직접 생성해주세요.

필수 키(백엔드 포트가 8080으로 바뀐 기준):
- `API_URL=http://localhost:8080`
  - Next.js rewrite 프록시 목적지(서버 사이드). `/api/*` → `${API_URL}/api/v1/*`
- `NEXT_PUBLIC_API_URL=http://localhost:8080`
  - 브라우저에서 직접 백엔드로 호출하는 URL(OAuth/로컬로그인 등)

추가 키:
- `ADMIN_HOST=admin.allinfluencer.co.kr` (운영 도메인 기준 값)

### 2) 의존성 설치
```bash
npm ci
```

### 3) 개발 서버 실행
```bash
npm run dev
```

- 접속: `http://localhost:3000`
- API 프록시: 프론트에서 `/api/...` 호출 시 `next.config.js`의 rewrites가 `API_URL`로 프록시합니다.

## 빌드/배포용 실행

### 1) 프로덕션 빌드
```bash
npm run build
```

### 2) 프로덕션 서버 실행
```bash
npm run start
```

## Docker로 실행

```bash
docker compose up --build
```

> `docker-compose.yml`은 `./env.local`을 읽습니다. (컨테이너에서도 동일 파일 사용)

## Admin 페이지 접근 방법

### 접근 URL
- `http://localhost:3000/admin`

### 접근 조건
`/admin`은 **로컬호스트라고 해서 차단하지 않습니다.** 아래 조건을 만족해야 접근됩니다.
- 로그인 상태여야 함 (`/api/auth/me`가 200이어야 함)
- 로그인한 유저의 `role`이 `ADMIN`이어야 함 (`src/app/admin/AdminGate.tsx`)

### 로컬에서 admin이 “안 들어가지는” 흔한 원인/해결
- **백엔드 포트 변경(예: 8080) 미반영**
  - `env.local`의 `API_URL`, `NEXT_PUBLIC_API_URL`이 실제 백엔드 포트와 일치하는지 확인하세요.
- **쿠키가 로컬에서 저장/전송되지 않음**
  - 백엔드가 `Set-Cookie`에 `Domain=admin.allinfluencer.co.kr` 같은 고정 도메인을 설정하거나,
    `Secure`가 강제되는 경우 localhost에서 세션이 유지되지 않을 수 있습니다.
  - 이 경우 백엔드의 쿠키 설정을 로컬에서는 `Domain` 미설정(또는 `localhost`) / `Secure=false` 등으로 조정해야 합니다.

## 참고(프록시/환경변수 로딩 방식)
- Next 기본 규칙은 `.env.local` 자동 로드지만, 본 프로젝트는 `env.local`을 사용합니다.
- 로컬 개발에서 `env.local` 값이 `next.config.js`에서 로드되도록 처리되어 있습니다.

