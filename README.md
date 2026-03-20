# NuxtLayerBase

> **Nuxt 3 Base Layer** — 인증(OIDC), Alert/Confirm 모달, Tailwind CSS 설정, 공통 TypeScript 타입을 포함한 레이어입니다.

세 개 이상의 Nuxt 3 프로젝트에서 `extends` 키워드를 통해 상속받아 사용하는 공통 기반 레이어입니다.

---

## 폴더 구조

```
NuxtLayerBase/
├── assets/
│   └── css/
│       └── main.css          # Tailwind base CSS + CSS 커스텀 프로퍼티
├── components/
│   ├── BaseAlert.vue         # 전역 Alert 모달 컴포넌트
│   └── BaseConfirm.vue       # 전역 Confirm 모달 컴포넌트
├── composables/
│   ├── useAlert.ts           # Promise 기반 Alert 컴포저블
│   ├── useApi.ts             # Bearer 토큰 자동 주입 fetch 래퍼
│   ├── useAuth.ts            # OIDC 인증 컴포저블 (oidc-client-ts)
│   ├── useCurrentUserProfile.ts # 인증 사용자 상세 조회 및 상태 동기화
│   └── useConfirm.ts         # Promise 기반 Confirm 컴포저블
├── middleware/
│   └── auth.global.ts        # 전역 라우트 인증 가드
├── plugins/
│   └── auth.client.ts        # 앱 시작 시 인증 상태 복원 플러그인
├── types/
│   └── index.ts              # User, AuthToken, ApiResponse<T> 등 공통 타입
├── .env.example              # 환경변수 설정 가이드
├── nuxt.config.ts            # 레이어 nuxt 설정
├── package.json
└── tailwind.config.ts        # 공통 Tailwind 설정
```

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Nuxt 3 |
| 스타일링 | Tailwind CSS (`@nuxtjs/tailwindcss`) |
| 인증 서버 | Duende Identity Server 4 (OIDC) |
| OIDC 클라이언트 | `oidc-client-ts` |
| 상태 관리 | Nuxt `useState` |
| 언어 | TypeScript (strict) |

---

## 하위 프로젝트에서 사용하는 방법

### 1. 의존성 추가

```bash
# npm
npm install github:gn2studio/NuxtLayerBase

# 또는 상대 경로로 로컬 레이어 참조 (모노레포 환경)
# nuxt.config.ts에서 extends: ['../NuxtLayerBase'] 사용
```

### 2. nuxt.config.ts 설정

```ts
// 하위 프로젝트의 nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@gn2studio/nuxt-layer-base'],

  // 레이어의 runtimeConfig를 .env 값으로 재정의
  runtimeConfig: {
    public: {
      // 필요 시 하위 프로젝트 전용 public 설정 추가
    },
  },
})
```

### 3. .env 파일 설정

`.env.example`을 복사하여 `.env`로 만들고 값을 채워 넣습니다.

```env
# OIDC / Duende Identity Server
NUXT_PUBLIC_OIDC_ISSUER=https://auth.example.com
NUXT_PUBLIC_OIDC_CLIENT_ID=my-spa-client
NUXT_PUBLIC_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback
NUXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000/
NUXT_PUBLIC_OIDC_SCOPE=openid profile email offline_access
NUXT_PUBLIC_OIDC_RESPONSE_TYPE=code

# 인증이 필요 없는 공개 라우트 (콤마 구분)
NUXT_PUBLIC_AUTH_PUBLIC_ROUTES=/,/about,/auth

# API 기본 URL
NUXT_PUBLIC_API_BASE_URL=https://api.example.com

# 인증 도메인 사용자 상세 API 기본 URL
NUXT_PUBLIC_AUTH_API_BASE_URL=https://auth-api.example.com
```

하위 프로젝트의 `nuxt.config.ts`에서 별도 선언이 없어도 `runtimeConfig.public.authApiBaseUrl`은
`NUXT_PUBLIC_AUTH_API_BASE_URL`과 자동으로 매핑됩니다. 필요하면 하위 프로젝트에서 아래처럼 명시적으로
오버라이드할 수 있습니다.

```ts
export default defineNuxtConfig({
  extends: ['@gn2studio/nuxt-layer-base'],
  runtimeConfig: {
    public: {
      authApiBaseUrl: process.env.NUXT_PUBLIC_AUTH_API_BASE_URL,
    },
  },
})
```

### 4. 레이아웃/app.vue에 모달 컴포넌트 추가

모달이 올바르게 렌더링되려면 루트 레이아웃 또는 `app.vue`에 두 컴포넌트를 마운트해야 합니다.

```vue
<!-- app.vue 또는 layouts/default.vue -->
<template>
  <div>
    <NuxtPage />

    <!-- 전역 모달 컴포넌트 -->
    <BaseAlert />
    <BaseConfirm />
  </div>
</template>
```

### 5. OIDC 콜백 페이지 만들기

`NUXT_PUBLIC_OIDC_REDIRECT_URI`에 지정된 경로에 콜백 페이지를 만듭니다.

```vue
<!-- pages/auth/callback.vue -->
<script setup lang="ts">
definePageMeta({ auth: false }) // 인증 미들웨어 제외

const { handleCallback } = useAuth()
const router = useRouter()

onMounted(async () => {
  await handleCallback()
  await router.replace('/')
})
</script>

<template>
  <div>로그인 처리 중...</div>
</template>
```

---

## API 레퍼런스

### `useAuth()`

```ts
const {
  isAuthenticated, // Ref<boolean>
  user,            // Ref<User | null>
  token,           // Ref<AuthToken | null>
  loading,         // Ref<boolean>
  error,           // Ref<string | null>

  login,               // (state?) => Promise<void>   — 로그인 리다이렉트
  logout,              // () => Promise<void>          — 로그아웃 리다이렉트
  handleCallback,      // () => Promise<void>          — 콜백 처리
  handleSilentCallback,// () => Promise<void>          — 사일런트 갱신 콜백
  loadUser,            // () => Promise<void>          — 스토리지에서 사용자 복원
  getAccessToken,      // () => string | null          — 현재 액세스 토큰 반환
  refreshToken,        // () => Promise<string | null> — 사일런트 토큰 갱신
} = useAuth()
```

`useAuth()`는 OIDC 인증 상태만 담당합니다. 사용자 표시 이름에 필요한 상세 정보는 아래
`useCurrentUserProfile()`이 별도로 관리합니다.

### `useCurrentUserProfile()`

```ts
const {
  profile,      // Ref<CurrentUserProfile | null>
  loading,      // Ref<boolean>
  error,        // Ref<string | null>
  displayName,  // Ref<string | null>
  loadProfile,  // (force?) => Promise<CurrentUserProfile | null>
  reload,       // () => Promise<CurrentUserProfile | null>
  clear,        // () => void
} = useCurrentUserProfile()
```

- 현재 인증된 사용자의 `user.id` 또는 OIDC `sub`를 사용해 `GET /api/Users/{id}`를 호출합니다.
- `Authorization: Bearer <access token>` 헤더는 기존 `useApi()` 토큰 로직을 그대로 사용합니다.
- 기본 호출 기준 URL은 `runtimeConfig.public.authApiBaseUrl`이며, 값이 없으면 `apiBaseUrl`로 폴백합니다.
- 로그인 콜백 성공 후, 앱 시작 시 `loadUser()`로 인증이 복원된 후, 이후 인증 사용자가 바뀌는 경우 자동으로 다시 조회됩니다.
- 로그아웃 또는 `userUnloaded` 시 상세 프로필 상태는 함께 정리됩니다.

### 로그인 후 사용자 상세 연결 흐름

1. `useAuth()`가 OIDC 로그인 콜백 또는 앱 시작 시 `loadUser()`로 인증 사용자를 복원합니다.
2. 레이어 플러그인이 `useCurrentUserProfile()` 동기화를 등록해 인증 사용자 ID를 감지합니다.
3. `useCurrentUserProfile()`이 `authApiBaseUrl + /api/Users/{id}`로 상세 정보를 조회합니다.
4. 하위 프로젝트는 `profile.userName` 또는 `displayName`을 바로 사용하면 됩니다.
5. 상세 조회가 실패하면 `displayName`은 OIDC 이름, 이메일, 사용자 ID 순으로 폴백합니다.

### 하위 프로젝트 표시 이름 예시

```vue
<script setup lang="ts">
const { user } = useAuth()
const { profile, displayName, loading } = useCurrentUserProfile()

const resolvedName = computed(() => {
  return profile.value?.userName || displayName.value || user.value?.email || 'Unknown user'
})
</script>

<template>
  <div>
    <span v-if="loading">사용자 정보를 불러오는 중...</span>
    <span v-else>{{ resolvedName }}</span>
  </div>
</template>
```

GN2MapFront 같은 하위 프로젝트에서는 기존 `user.name` 중심 표시 로직을 위와 같이 `profile.userName`
우선으로 바꾸면, 로그인 후 화면에 OIDC `sub` 대신 사용자 상세 API의 `userName`이 표시됩니다.

### `useApi(baseURL?)`

```ts
const { get, post, put, patch, del } = useApi()

// GET
const res = await get<User[]>('/api/users')
if (res.success) console.log(res.data)

// POST
const created = await post<User>('/api/users', { name: 'Alice', email: 'alice@example.com' })

// PUT / PATCH / DELETE
await put<User>('/api/users/1', { name: 'Bob' })
await patch<User>('/api/users/1', { email: 'bob@example.com' })
await del('/api/users/1')
```

### `useAlert()`

```ts
const { alert } = useAlert()

// 문자열로 간단히 호출
await alert('저장되었습니다.')

// 옵션 객체로 상세 설정
await alert({
  title: '성공',
  message: '데이터가 저장되었습니다.',
  type: 'success',   // 'info' | 'success' | 'warning' | 'error'
  okLabel: '확인',
})
```

### `useConfirm()`

```ts
const { confirm } = useConfirm()

// 문자열로 간단히 호출
const ok = await confirm('삭제하시겠습니까?')
if (ok) { /* 삭제 로직 */ }

// 옵션 객체로 상세 설정
const confirmed = await confirm({
  title: '삭제 확인',
  message: '이 항목을 삭제하면 복구할 수 없습니다.',
  type: 'danger',      // 'info' | 'success' | 'warning' | 'danger'
  okLabel: '삭제',
  cancelLabel: '취소',
})
```

---

## Tailwind CSS 커스터마이징

### 색상 확장

```ts
// 하위 프로젝트의 tailwind.config.ts
import baseConfig from '@gn2studio/nuxt-layer-base/tailwind.config'

export default {
  ...baseConfig,
  theme: {
    extend: {
      ...baseConfig.theme?.extend,
      colors: {
        ...baseConfig.theme?.extend?.colors,
        brand: {
          500: '#8b5cf6', // 프로젝트 고유 brand 색상으로 교체
          600: '#7c3aed',
        },
      },
    },
  },
}
```

### 폰트 교체

```ts
// 하위 프로젝트의 tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
}
```

---

## 공통 타입

```ts
import type { User, AuthToken, ApiResponse, Pagination } from '~/types'
```

| 타입 | 설명 |
|------|------|
| `User` | 사용자 정보 (id, email, name, roles, …) |
| `AuthToken` | 액세스/리프레시 토큰 및 만료 정보 |
| `ApiResponse<T>` | 공통 API 응답 래퍼 (success, statusCode, message, data) |
| `Pagination` | 페이지네이션 메타데이터 |
| `AuthState` | useState로 관리되는 인증 상태 |
| `AlertOptions` | useAlert 옵션 |
| `ConfirmOptions` | useConfirm 옵션 |

---

## 라이선스

MIT
