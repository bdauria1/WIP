<template>
  <div class="mx-auto max-w-xl px-4 py-10 sm:px-6">
    <div class="deco-frame px-6 py-8 sm:px-8">
      <h2 class="deco-title text-center text-2xl">Account</h2>

      <p v-if="!configured" class="mt-6 text-sm leading-relaxed text-gold-dim">
        Account login needs a Supabase project. Follow the setup steps in the project README,
        then add its URL and publishable key to <code>web/.env</code>.
      </p>

      <p v-else-if="!ready" class="mt-6 text-center text-sm text-gold-dim" role="status">
        Checking your account…
      </p>

      <template v-else-if="user">
        <p class="mt-6 text-center text-sm text-gold-dim">Signed in as</p>
        <p class="mt-2 break-all text-center text-glow">{{ user.email }}</p>
        <p class="mt-5 text-center text-sm leading-relaxed text-gold-dim">
          Your practice progress is saved to your account. Camera video stays on this device.
        </p>
        <p class="mt-3 text-center text-xs leading-relaxed text-gold-dim/80">
          Browser-only progress from before sign-in remains separate and is not imported.
        </p>
        <p v-if="progressError" class="mt-4 text-sm text-ember" role="alert">
          {{ progressError }}
          <button
            type="button"
            class="ml-2 underline underline-offset-4 hover:text-gold"
            @click="refreshUserProgress"
          >
            Retry
          </button>
        </p>
        <p v-if="formError" class="mt-4 text-sm text-ember" role="alert">{{ formError }}</p>
        <button
          type="button"
          class="deco-btn mt-6 w-full"
          :disabled="submitting"
          @click="logout"
        >
          {{ submitting ? 'Signing out…' : 'Sign out' }}
        </button>
      </template>

      <form v-else class="mt-6 space-y-4" @submit.prevent="submit">
        <p class="text-center text-sm text-gold-dim">
          {{ mode === 'sign-in' ? 'Sign in to sync your practice progress.' : 'Create an account to save your progress.' }}
        </p>

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
        <p v-if="message" class="text-sm text-glow" role="status">{{ message }}</p>

        <button type="submit" class="deco-btn w-full" :disabled="submitting">
          {{ submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account' }}
        </button>
        <button
          type="button"
          class="w-full py-2 text-xs uppercase tracking-[0.2em] text-gold-dim underline underline-offset-4 hover:text-gold"
          :disabled="submitting"
          @click="toggleMode"
        >
          {{ mode === 'sign-in' ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useProgress } from '../composables/useProgress'
import { supabaseConfigured } from '../lib/supabase'

const { user, ready, error: authError, signIn, signUp, signOut } = useAuth()
const { error: progressError, refreshUserProgress } = useProgress()
const configured = supabaseConfigured
const mode = ref('sign-in')
const email = ref('')
const password = ref('')
const submitting = ref(false)
const formError = ref('')
const message = ref('')

function toggleMode() {
  mode.value = mode.value === 'sign-in' ? 'sign-up' : 'sign-in'
  formError.value = ''
  message.value = ''
}

async function submit() {
  submitting.value = true
  formError.value = ''
  message.value = ''
  try {
    const result = mode.value === 'sign-in'
      ? await signIn(email.value, password.value)
      : await signUp(email.value, password.value)
    if (result.error) throw result.error
    if (mode.value === 'sign-up' && !result.data.session) {
      message.value = 'Check your email for a confirmation link before signing in.'
    }
  } catch (error) {
    formError.value = error.message
  } finally {
    submitting.value = false
  }
}

async function logout() {
  submitting.value = true
  formError.value = ''
  try {
    const { error } = await signOut()
    if (error) throw error
  } catch (error) {
    formError.value = error.message
  } finally {
    submitting.value = false
  }
}
</script>
