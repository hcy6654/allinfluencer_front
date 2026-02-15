# ALLINFLUENCER_FRONT Frontend Rules (FSD)

Next.js (App Router) + TanStack Query  
Feature-Sliced Design Architecture

---

## 0. 목표

- 규모가 커져도 폴더가 무너지지 않는 구조 유지
- 변경 범위를 기능 단위로 좁혀 유지보수성 향상
- UI/로직/서버데이터를 분리해서 코드 가독성 확보
- Next.js App Router와 자연스럽게 결합

---

## 1. 기본 원칙 (Core Principles)

### 1.1 TypeScript 규칙

- 모든 파일은 `.ts / .tsx`를 사용합니다.
- `any`는 최후의 수단으로만 사용합니다.
- `any` 사용 시 반드시 TODO 주석을 남깁니다.

```ts
const data: any = response.data; // TODO: API 응답 타입 정의 필요
```

---

### 1.2 View와 Logic 분리

- UI 렌더링(TSX)과 비즈니스 로직(상태 관리, 데이터 호출, 핸들러)을 분리합니다.
- 컴포넌트 내부에 `useState`, `useEffect`, 핸들러가 과도해지면 Custom Hook으로 분리합니다.
- 서버 데이터는 TanStack Query로 관리하며, `useEffect + fetch` 직접 호출은 지양합니다.

---

### 1.3 성급한 최적화 지양

- `useMemo`, `useCallback`은 성능 이슈가 확실하거나 꼭 필요할 때만 사용합니다.
- 기본은 단순하고 읽기 쉽게 작성합니다.

---

### 1.4 PR 및 빌드 규칙

- PR 전 반드시 `npm run build` 실행 후 push합니다.
- 작업 완료 후 최신 main과 Sync를 맞춥니다.

---

## 2. 파일 및 폴더 구조 (FSD)

FSD는 “재사용 범위”에 따라 코드를 계층화합니다.  
(재사용 범위가 넓을수록 상위(shared), 좁을수록 하위(pages/features)로 둡니다.)

### 2.1 프로젝트 구조

```
src/
  app/                         # Next.js App Router (라우팅/레이아웃)
    layout.tsx
    page.tsx
    globals.css
    (routes)/                  # route group (선택)
      admin/
      auth/
      jobs/
      my/
      settings/

  pages/                       # (선택) 페이지 조립 레이어 (FSD pages)
    admin-approvals/
    auth-login/
    jobs/
    my-advertiser/
    my-influencer/
    settings-accounts/

  widgets/                     # 페이지를 구성하는 큰 블록(섹션/패널 단위)
    admin-approvals/
    auth/
    header/
    sidebar/

  features/                    # 사용자 행동 단위(로그인/승인/신청/좋아요 등)
    auth/
      login/
      logout/
    approvals/
      approve-advertiser/
      approve-influencer/

  entities/                    # 도메인 엔티티(Users, Jobs 등)
    user/
    job/
    approval/

  shared/                      # 전역 공통(재사용 범위 최상)
    api/
      api-client.ts
    config/
    hooks/
    styles/
    types/
    ui/
    utils/
```

> Next.js의 실제 라우팅은 `src/app/**`가 담당합니다.  
> FSD의 `pages/`는 “라우팅이 아니라 페이지 조립/구성 레이어”로 사용하며, 필요 없으면 생략해도 됩니다.  
> (즉, `app/**` 안에서 바로 widgets/features/entities를 불러와도 됨)

---

### 2.2 레이어 역할 요약

- `app/` : Next 라우팅/레이아웃, 전역 Provider, 메타데이터
- `pages/` : 특정 페이지 조립(선택)
- `widgets/` : 페이지를 구성하는 큰 UI 블록
- `features/` : 사용자의 행동(버튼 클릭/승인/로그인 등)
- `entities/` : 도메인 모델(유저/잡/승인 등)과 관련 UI/타입/쿼리
- `shared/` : 범용 유틸/공통 UI/공통 스타일/공통 API

---

## 3. 네이밍 컨벤션 (Naming Convention)

### 3.1 파일 및 컴포넌트

- 컴포넌트 파일: `PascalCase` (예: `UserProfile.tsx`)
- Hook 파일: `camelCase` + `use` 접두사 (예: `useAuth.ts`)
- 유틸/함수 파일: `camelCase` (예: `formatDate.ts`)

### 3.2 변수 및 함수

- 변수/함수: `camelCase`
- Boolean 변수: `is`, `has`, `should` 접두사 사용
- 상수: `UPPER_SNAKE_CASE`

### 3.3 이벤트 핸들러 (중요 ⭐)

- Props로 넘길 때: `onXxx`
- 내부 정의: `handleXxx`

```tsx
const handleClick = () => {
  /* ... */
};
return <Button onClick={handleClick} />;
```

---

## 4. 컴포넌트 아키텍처 (View & Logic Separation)

### 4.1 작성 규칙

1. 컴포넌트 내부에 로직이 많아지면 `use[Feature]Logic.ts`로 분리합니다.
2. Hook은 상태(State)와 액션(Actions)을 직관적인 이름으로 반환합니다.
3. View(TSX)는 로직을 몰라도 사용 가능하도록 구성합니다.

### 4.2 예시

#### ❌ Bad

```tsx
export const UserList = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    /* fetch */
  }, []);
  const handleDelete = (id: string) => {
    /* ... */
  };
  return <div />;
};
```

#### ✅ Good

```tsx
// useUserListLogic.ts
export const useUserListLogic = () => {
  return { users, loading, error, handleDelete };
};

// UserList.tsx
export const UserList = () => {
  const { users, loading, error, handleDelete } = useUserListLogic();
  if (loading) return <Loader />;
  if (error) return <ErrorBox />;
  return <List users={users} onDelete={handleDelete} />;
};
```

---

## 5. 서버 상태 관리 (TanStack Query) — 필수

### 5.1 기본 원칙

- 서버 상태는 TanStack Query로만 관리합니다.
- `useEffect + fetch` 직접 호출은 지양합니다.
- Query Key는 배열 기반으로 통일합니다.

---

### 5.2 Query Key 컨벤션

도메인별로 key를 정의합니다.  
(보통 `entities/<domain>/api/keys.ts` 또는 `entities/<domain>/api/`에 위치)

```ts
export const usersKeys = {
  all: ["users"] as const,
  list: (params: UsersParams) => ["users", "list", params] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};
```

---

### 5.3 Query / Mutation 규칙

- 조회: `useQuery`
- 변경: `useMutation`
- 변경 성공 시 `invalidateQueries`로 동기화

```ts
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}
```

---

### 5.4 “훅 위치” 규칙 (FSD 기준)

- 엔티티 조회/상세 같은 “도메인 데이터”는 `entities/<domain>/api`에 둡니다.
- 사용자 행동(승인/로그인 등)과 결합된 mutation은 `features/<feature>/api`로 둡니다.
- 단순 공통 요청은 `shared/api`로 둡니다.

예시:

```
entities/user/api/useUsersQuery.ts
features/approvals/approve-influencer/api/useApproveInfluencerMutation.ts
shared/api/api-client.ts
```

---

## 6. 스타일 분리 및 관리 (Style Separation)

### 6.1 스타일 분리 원칙

1. 인라인 스타일(`style={{}}`)은 지양합니다.
2. “어디서 재사용되느냐”에 따라 위치를 정합니다.

### 6.2 위치 규칙 (FSD 기준)

- 전역 토큰/변수/공통 스타일: `shared/styles/`
- 공통 UI 컴포넌트 스타일: `shared/ui/` 내부에 함께 배치
- 특정 widget 전용 스타일: `widgets/<name>/` 내부
- 특정 feature 전용 스타일: `features/<name>/` 내부
- 특정 entity 전용 스타일: `entities/<name>/` 내부
- 페이지 단일 전용 스타일: `pages/<name>/` 내부(사용 시)

### 6.3 우선순위

1. Tailwind (기본 레이아웃/간격)
2. CSS Modules (`*.module.css`)
3. TS 스타일 상수(`CSSProperties`)는 특수 케이스에만 사용

---

## 7. 성능 최적화 (Optimization)

1. 습관적인 `useMemo`, `useCallback` 남용 금지
2. 필요한 경우
   - 무거운 연산(대용량 필터/정렬)
   - 참조 동일성 유지 필요
   - `React.memo` 컴포넌트 리렌더 방지 필요

---

## 8. 리팩토링 가이드 (Refactoring Guide)

### 8.1 체크리스트

1. 스타일 분리
2. 로직 분리(Custom Hook)
3. 타입 보강(필요 시)
4. 서버 데이터 호출은 TanStack Query로 통일
5. 재사용 범위에 맞게 shared/entities/features/widgets로 승격

### 8.2 승격 규칙(중요)

- 한 페이지에서만 쓰면: pages 또는 해당 route 근처
- 두 곳 이상에서 쓰기 시작하면: widgets/features/entities로 승격
- 여러 도메인/전역에서 공통이면: shared로 승격

---

## 9. Redux/RTK 관련 규칙 (삭제/미사용)

- Redux Toolkit / RTK Query / store/slices 구조는 사용하지 않습니다.
- 서버 데이터는 TanStack Query로 통일합니다.
- 전역 UI 상태가 필요하면 Context 또는 Zustand 등 경량 도구를 “필요할 때만” 사용합니다.

---

## 10. 코드 가독성 및 유지보수성 (Code Quality)

### 10.1 Magic Number 상수화

- 의미 없는 숫자 리터럴은 상수화합니다.

### 10.2 복잡한 조건문 네이밍

- AND/OR가 2개 이상 연결되면 변수로 추출 고려

### 10.3 중첩 삼항 단순화

- 중첩 삼항은 IIFE 또는 if/else로 변경

### 10.4 조건부 렌더링 컴포넌트 분리

- 조건에 따라 UI/로직이 크게 달라지면 분리

### 10.5 Props Drilling 제거

- 2단계 이상 전달되면 Composition 고려
- Context는 인증/테마 등 “진짜 전역”에만 사용

### 10.6 Early Return

- 예외 케이스를 먼저 처리하여 중첩을 줄입니다.

---

## 11. PR / 협업 규칙

1. PR 전 `npm run build`
2. 기능 단위 커밋
3. main sync 후 merge
4. 구조 위반(레이어 역할/위치) 발견 시 수정 요청 가능

---

END
