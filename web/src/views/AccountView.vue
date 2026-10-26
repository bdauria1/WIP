<template>
  <div class="mx-auto max-w-xl px-4 py-10 sm:px-6">
    <div class="deco-frame px-6 py-8 sm:px-8">
      <h2 class="deco-title text-center text-2xl">Account</h2>

      <template v-if="user">
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProgress } from '../composables/useProgress'

const router = useRouter()
const { user, signOut } = useAuth()
const { error: progressError, refreshUserProgress } = useProgress()
const submitting = ref(false)
const formError = ref('')

async function logout() {
  submitting.value = true
  formError.value = ''
  try {
    const { error } = await signOut()
    if (error) throw error
    router.push('/')
  } catch (error) {
    formError.value = error.message
  } finally {
    submitting.value = false
  }
}
</script>
