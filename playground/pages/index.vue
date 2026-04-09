<script setup lang="ts">
definePageMeta({ auth: false })

const { alert } = useAlert()
const { confirm } = useConfirm()
const { toast } = useToast()
const { loading } = useLoading()
const { startProgress, completeStep } = useProgressLoading()

const lastResult = ref('대기 중')
const repositoryUrl = 'https://github.com/gn2studio/NuxtLayerBase'

async function showAlert() {
  await alert({
    title: 'Payment successful',
    message:
      "Your payment has been successfully submitted. We've sent you an email with all of the details of your order.",
    okLabel: 'Got it, thanks!',
  })

  lastResult.value = 'Alert 닫힘'
}

async function showConfirm() {
  const ok = await confirm({
    title: 'Delete project',
    message:
      'Are you sure you want to delete this project? This action cannot be undone.',
    okLabel: 'Delete',
    cancelLabel: 'Cancel',
  })

  lastResult.value = ok ? 'Confirm: Delete' : 'Confirm: Cancel'
}

function showToast() {
  toast({
    title: 'Changes saved',
    message: 'Your project settings have been updated successfully.',
    duration: 2800,
  })

  lastResult.value = 'Toast 표시'
}

function showLoadingPreview() {
  loading(true, 'Please wait while we process your request...')
  lastResult.value = 'Loading 시작 (3초 후 종료)'

  setTimeout(() => {
    loading(false)
    lastResult.value = 'Loading 종료'
  }, 3000)
}

function showProgressLoadingPreview() {
  startProgress(3, 'Processing your queued jobs...')
  lastResult.value = 'Progress Loading 시작 (초당 1/3)'

  let done = 0
  const timer = setInterval(() => {
    done += 1
    completeStep()

    if (done >= 3) {
      clearInterval(timer)
      lastResult.value = 'Progress Loading 종료 (100%)'
    }
  }, 1000)
}
</script>

<template>
  <main class="relative min-h-screen overflow-hidden bg-[#030712] px-6 py-10 text-slate-100 sm:px-8">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-200/10 blur-3xl" />
      <div class="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-200/10 blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-5xl space-y-8">
      <header class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Preview</p>
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">GN2Studio UI Components</h1>
        <p class="max-w-2xl text-base text-slate-300">
          Headless UI 레퍼런스를 참고해, 타입 분기 없이 어떤 프로젝트에도 자연스럽게 어울리는 범용 대화상자 스타일로 구성했습니다.
        </p>
      </header>

      <section class="rounded-2xl border border-cyan-200/20 bg-cyan-100/[0.04] p-5 backdrop-blur-sm">
        <h2 class="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200/90">Repository</h2>
        <p class="mt-3 text-sm leading-6 text-slate-200">
          이 미리보기의 소스 레이어는 아래 GitHub 저장소에서 확인할 수 있습니다. 이슈 등록, 사용법 확인,
          최신 변경사항 추적이 필요하면 저장소 페이지로 이동하세요.
        </p>
        <a
          class="mt-4 inline-flex items-center rounded-md border border-cyan-200/40 bg-cyan-200/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-200/25 focus:outline-none focus:ring-2 focus:ring-cyan-200/70"
          :href="repositoryUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to NuxtLayerBase Repository
        </a>
        <p class="mt-3 break-all text-xs text-cyan-100/80">{{ repositoryUrl }}</p>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
          <h2 class="text-lg font-semibold">Alert demo</h2>
          <p class="mt-2 text-sm leading-6 text-slate-300">
            안내성 메시지를 단일 액션으로 닫는 기본 Alert입니다.
          </p>
          <button
            class="mt-4 inline-flex items-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            @click="showAlert"
          >
            Open alert
          </button>
        </article>

        <article class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
          <h2 class="text-lg font-semibold">Confirm demo</h2>
          <p class="mt-2 text-sm leading-6 text-slate-300">
            사용자 선택이 필요한 작업을 확인하는 기본 Confirm입니다.
          </p>
          <button
            class="mt-4 inline-flex items-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            @click="showConfirm"
          >
            Open confirm
          </button>
        </article>

        <article class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
          <h2 class="text-lg font-semibold">Toast demo</h2>
          <p class="mt-2 text-sm leading-6 text-slate-300">
            잠깐 표시되고 사라지는 비차단 알림입니다.
          </p>
          <button
            class="mt-4 inline-flex items-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            @click="showToast"
          >
            Show toast
          </button>
        </article>

        <article class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
          <h2 class="text-lg font-semibold">Loading demo</h2>
          <p class="mt-2 text-sm leading-6 text-slate-300">
            플래그 파라미터로 켜고 끄는 전역 로딩 오버레이입니다.
          </p>
          <button
            class="mt-4 inline-flex items-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            @click="showLoadingPreview"
          >
            Show loading (3s)
          </button>
        </article>

        <article class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
          <h2 class="text-lg font-semibold">Progress Loading demo</h2>
          <p class="mt-2 text-sm leading-6 text-slate-300">
            완료된 작업 수에 따라 프로그레스바가 증가하고 100%에서 자동 종료됩니다.
          </p>
          <button
            class="mt-4 inline-flex items-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            @click="showProgressLoadingPreview"
          >
            Show progress loading
          </button>
        </article>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Last result</h2>
        <p class="mt-3 text-base text-slate-100">{{ lastResult }}</p>
      </section>
    </div>
  </main>
</template>
