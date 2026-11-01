<template>
  <div class="mx-auto max-w-md px-4 py-14 sm:px-6">
    <div class="deco-frame px-6 py-10 sm:px-8">
      <h1 class="deco-title text-center text-2xl sm:text-3xl">
        {{ mode === 'sign-in' ? 'Welcome back' : 'Create account' }}
      </h1>
      <p class="mt-3 text-center text-sm text-gold-dim">
        {{ mode === 'sign-in' ? 'Sign in to sync your practice progress.' : 'Save your streaks and scores across devices.' }}
      </p>

      <div class="mt-8 grid grid-cols-2 gap-2" role="tablist" aria-label="Account">
        <button
          type="button"
          role="tab"
          class="deco-btn"
          :class="{ 'deco-btn-active': mode === 'sign-in' }"
          :aria-selected="mode === 'sign-in'"
          @click="setMode('sign-in')"
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          class="deco-btn"
          :class="{ 'deco-btn-active': mode === 'sign-up' }"
          :aria-selected="mode === 'sign-up'"
          @click="setMode('sign-up')"
        >
          Sign up
        </button>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="submit">
        <label class="block text-xs uppercase tracking-[0.25em] text-gold-dim">
          Email
          <input
            v-model.trim="email"
            class="mt-2 w-full border border-gold-dim/60 bg-ink px-3 py-3 text-sm text-gold outline-none focus:border-gold"
            type="email"
            autocomplete="email"
            required
          >
        </label>
        <label class="block text-xs uppercase tracking-[0.25em] text-gold-dim">
          Password
          <input
            v-model="password"
            class="mt-2 w-full border border-gold-dim/60 bg-ink px-3 py-3 text-sm text-gold outline-none focus:border-gold"
            type="password"
            :autocomplete="mode === 'sign-up' ? 'new-password' : 'current-password'"
            minlength="8"
            required
          >
        </label>
        <p v-if="mode === 'sign-up'" class="text-xs text-gold-dim">
          Use at least 8 characters.
        </p>

        <p v-if="authError || formError" class="text-sm text-ember" role="alert">
          {{ formError || authError }}
        </p>

        <button type="submit" class="deco-btn deco-btn-active w-full" :disabled="submitting">
          {{ submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account' }}
        </button>
      </form>

      <div class="deco-rule mt-8"><span></span></div>
      <p class="mt-6 text-center text-xs uppercase tracking-[0.2em] text-gold-dim">
        <RouterLink to="/practice" class="underline underline-offset-4 hover:text-gold">
          Continue as guest
        </RouterLink>
      </p>
      <p class="mt-3 text-center text-[11px] leading-relaxed text-gold-dim/70">
        Guest progress is stored only in this browser.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, error: authError, signIn, signUp } = useAuth()
const mode = ref(route.query.mode === 'signup' ? 'sign-up' : 'sign-in')
const email = ref('')
const password = ref('')
const submitting = ref(false)
const formError = ref('')

watch(() => route.query.mode, (value) => {
  mode.value = value === 'signup' ? 'sign-up' : 'sign-in'
})

watch(user, (value) => {
  if (value) router.replace(redirectTarget())
})

function redirectTarget() {
  const target = route.query.redirect
  return typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')
    ? target
    : '/practice'
}

function setMode(value) {
  if (mode.value === value) return
  formError.value = ''
  router.replace({ query: { ...route.query, mode: value === 'sign-up' ? 'signup' : undefined } })
}

async function submit() {
  submitting.value = true
  formError.value = ''
  try {
    if (mode.value === 'sign-in') await signIn(email.value, password.value)
    else await signUp(email.value, password.value)
  } catch (error) {
    formError.value = error.message
  } finally {
    submitting.value = false
  }
}
</script>
