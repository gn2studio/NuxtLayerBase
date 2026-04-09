# NuxtLayerBase

> **Nuxt 3 Base Layer** — 인증(OIDC), Alert/Confirm/Toast/Loading UI, Tailwind CSS 설정, 공통 TypeScript 타입을 포함한 레이어입니다.

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
│   ├── BaseConfirm.vue       # 전역 Confirm 모달 컴포넌트
│   ├── BaseToast.vue         # 전역 Toast 컴포넌트
│   ├── BaseLoading.vue       # 전역 Loading 오버레이 컴포넌트
│   └── BaseProgressLoading.vue # 전역 Progress Loading 오버레이
├── composables/
│   ├── useAlert.ts           # Promise 기반 Alert 컴포저블
│   ├── useApi.ts             # Bearer 토큰 자동 주입 fetch 래퍼
│   ├── useAuth.ts            # OIDC 인증 컴포저블 (oidc-client-ts)
│   ├── useCurrentUserProfile.ts # 인증 사용자 상세 조회 및 상태 동기화
│   ├── useConfirm.ts         # Promise 기반 Confirm 컴포저블
│   ├── useToast.ts           # 전역 Toast 컴포저블
│   ├── useLoading.ts         # 플래그 기반 Loading 컴포저블
│   └── useProgressLoading.ts # 단계 기반 Progress Loading 컴포저블
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

## AI 작업 지시용 빠른 컨텍스트

이 문서는 사람이 읽는 가이드이면서, AI 코드 에이전트에게 작업을 지시할 때 바로 참고시키는 목적으로도 작성되었습니다.

### AI에게 먼저 전달할 프로젝트 사실

- 이 저장소는 **Nuxt 3 Layer**이며, 소비자 프로젝트에서 `extends`로 연결해 사용합니다.
- 핵심 기능은 인증(OIDC) + 전역 UI(`BaseAlert`, `BaseConfirm`, `BaseToast`, `BaseLoading`, `BaseProgressLoading`)입니다.
- 전역 UI는 소비자 앱의 루트(`app.vue` 또는 레이아웃)에 직접 마운트해야 동작합니다.
- 기본 UI를 쓰기 싫으면 `NUXT_PUBLIC_UI_USE_BUILT_IN_*` 플래그로 비활성화하고 소비자 프로젝트에서 같은 이름 컴포넌트로 오버라이드할 수 있습니다.
- 미리보기 앱은 `playground`이며, 정적 결과물은 `playground/.output/public` 및 패키징 폴더 `preview-dist`입니다.
- 배포 자동화(Action)는 사용하지 않고 수동 배포 스크립트(`build:preview:manual`, `scripts/build-preview-manual.bat`)를 사용합니다.
- 저장소 URL: https://github.com/gn2studio/NuxtLayerBase

### AI에게 작업 요청할 때 포함하면 좋은 체크리스트

1. 대상이 레이어 코드인지, 소비자 프로젝트 코드인지 명확히 지정
2. 변경 파일 범위를 명시 (예: `composables/useAuth.ts`, `README.md`만 수정)
3. UI를 기본 컴포넌트로 유지할지, 소비자 오버라이드 방식으로 갈지 지정
4. 인증 관련 변경이면 `.env` 키와 `runtimeConfig.public` 매핑까지 함께 요구
5. 완료 후 검증 명령(`npm run generate:preview` 등) 실행을 요구
6. README 반영 여부(사용법/환경변수/API 예시 업데이트)를 같이 요구

### 복붙용 프롬프트 템플릿

#### 템플릿 A: 소비자 프로젝트에 레이어 연동

```text
다음 저장소의 Nuxt Layer를 현재 프로젝트에 연동해줘.
https://github.com/gn2studio/NuxtLayerBase

요구사항:
1) nuxt.config.ts에 extends 설정 추가
2) app.vue(또는 루트 레이아웃)에 BaseAlert/BaseConfirm/BaseToast/BaseLoading/BaseProgressLoading 마운트
3) .env.example 기준으로 필요한 환경변수 키를 현재 프로젝트 .env에 반영
4) 인증 콜백 페이지가 없으면 pages/auth/callback.vue 생성
5) 변경 후 실행 검증 명령과 결과를 요약

제약:
- 기존 프로젝트 구조/네이밍을 최대한 유지
- 불필요한 파일 리네임 금지
- 마지막에 변경 파일 목록과 이유를 짧게 정리
```

#### 템플릿 B: 기본 UI 비활성화 + 커스텀 UI로 전환

```text
NuxtLayerBase의 인증 기능은 유지하고, 기본 Alert/Confirm/Toast/Loading UI는 비활성화해서
우리 프로젝트 커스텀 컴포넌트를 사용하도록 바꿔줘.

요구사항:
1) NUXT_PUBLIC_UI_USE_BUILT_IN_ALERT/CONFIRM/TOAST/LOADING/PROGRESS_LOADING=false 설정
2) 기존 사용 코드(useAlert/useConfirm/useToast/useLoading/useProgressLoading)는 유지
3) 우리 프로젝트 컴포넌트에서 동일한 동작/접근성(키보드 포커스, aria) 보장
4) 문서(README 또는 팀 문서)에 오버라이드 방식과 유지보수 포인트 추가

검증:
- 모달/토스트/로딩 표시 및 닫힘 동작 수동 테스트 시나리오 작성
```

#### 템플릿 C: 미리보기 배포 준비

```text
NuxtLayerBase 미리보기(playground)를 github.io에 수동 배포할 수 있게 준비해줘.

요구사항:
1) baseURL을 인자로 받는 cmd 배치파일 점검/개선
2) npm run build:preview:manual 실행 후 preview-dist 생성 확인
3) README에 PowerShell/cmd 각각의 실행 예시와 업로드 대상 폴더 명확히 기재
4) 실패 시 흔한 원인(경로, baseURL, 환경변수)을 트러블슈팅으로 추가

출력:
- 실제 실행한 명령
- 생성된 산출물 위치
- 배포 직전 체크리스트
```

### AI에게 피해야 할 지시 예시

- “알아서 전부 바꿔줘”처럼 범위가 무제한인 요청
- 레이어/소비자 프로젝트 경계를 지정하지 않는 요청
- 검증 명령 없이 구현만 요구하는 요청
- 문서 업데이트를 제외한 요청 (협업 시 문서 누락 위험)

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

### 4. 레이아웃/app.vue에 UI 컴포넌트 추가

모달/토스트/로딩 UI가 올바르게 렌더링되려면 루트 레이아웃 또는 `app.vue`에 컴포넌트를 마운트해야 합니다.

```vue
<!-- app.vue 또는 layouts/default.vue -->
<template>
  <div>
    <NuxtPage />

    <!-- 전역 UI 컴포넌트 -->
    <BaseAlert />
    <BaseConfirm />
    <BaseToast />
    <BaseLoading />
    <BaseProgressLoading />
  </div>
</template>
```

### 4-1. 디자인 커스터마이징 / 기본 UI 비활성화

하위 프로젝트에서 사이트 디자인에 맞게 바꾸고 싶다면, 아래 두 가지 방식 중 하나를 선택할 수 있습니다.

1) **컴포넌트 오버라이드(권장)**

- 하위 프로젝트에 같은 이름의 컴포넌트를 만들면 레이어 기본 UI 대신 사용됩니다.
- 예: `components/BaseAlert.vue`, `components/BaseConfirm.vue`, `components/BaseToast.vue`, `components/BaseLoading.vue`, `components/BaseProgressLoading.vue`

2) **레이어 기본 UI 비활성화 후 직접 구현**

- 인증 기능만 사용하고 UI는 직접 만들려면 아래 설정을 `false`로 지정합니다.

```env
NUXT_PUBLIC_UI_USE_BUILT_IN_ALERT=false
NUXT_PUBLIC_UI_USE_BUILT_IN_CONFIRM=false
NUXT_PUBLIC_UI_USE_BUILT_IN_TOAST=false
NUXT_PUBLIC_UI_USE_BUILT_IN_LOADING=false
NUXT_PUBLIC_UI_USE_BUILT_IN_PROGRESS_LOADING=false
```

- 기본 UI z-index도 런타임 설정으로 조정할 수 있습니다.

```env
NUXT_PUBLIC_UI_OVERLAY_Z_INDEX=2147483000
NUXT_PUBLIC_UI_TOAST_Z_INDEX=2147483001
NUXT_PUBLIC_UI_LOADING_Z_INDEX=2147483002
NUXT_PUBLIC_UI_PROGRESS_LOADING_Z_INDEX=2147483003
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
  okLabel: '삭제',
  cancelLabel: '취소',
})
```

### `useToast()`

```ts
const { toast, dismiss, clear } = useToast()

// 문자열로 간단히 호출
toast('저장되었습니다.')

// 옵션 객체로 상세 설정
toast({
  title: '저장 완료',
  message: '변경 사항이 성공적으로 반영되었습니다.',
  duration: 2800, // ms, 0 이하면 자동 닫힘 비활성화
})

// 특정 토스트 닫기 / 전체 닫기
dismiss(id)
clear()
```

### `useLoading()`

```ts
const { loading, hide, state } = useLoading()

// 표시
loading(true, '데이터를 불러오는 중입니다...')

// 숨김
loading(false)

// 또는 hide() 사용
hide()
```

- `loading(flag, message|options)` 형태의 플래그 기반 API입니다.
- 반복 호출 시 마지막 메시지가 반영됩니다.

### `useProgressLoading()`

```ts
const { startProgress, completeStep, setProgress, progressPercent, hide, reset } = useProgressLoading()

// 총 3개 작업으로 시작
startProgress(3, '작업을 처리하고 있습니다...')

// 작업 1개 완료 (33%)
completeStep()

// 진행률 직접 지정
setProgress(2) // 66%

// 100% 도달 시 자동으로 오버레이가 닫힘
completeStep() // 100%
```

- 단계 기반(progress) 로딩입니다.
- `completedSteps >= totalSteps`가 되면 자동 종료됩니다.

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
import type {
  User,
  AuthToken,
  ApiResponse,
  Pagination,
  AlertOptions,
  ConfirmOptions,
  ToastOptions,
  LoadingOptions,
  ProgressLoadingOptions,
} from '~/types'
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
| `ToastOptions` | useToast 옵션 |
| `LoadingOptions` | useLoading 옵션 |
| `ProgressLoadingOptions` | useProgressLoading 옵션 |

---

## 라이선스

MIT
