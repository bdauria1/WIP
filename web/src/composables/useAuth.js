import { ref } from 'vue'
import { pb, errorMessage } from '../lib/pocketbase'

export const authUser = ref(null)
export const authReady = ref(false)
export const authError = ref('')

let initialized = false

export async function initializeAuth() {
  if (initialized) return
  initialized = true

  pb.authStore.onChange((_token, record) => {
    authUser.value = record ?? null
  })

  try {
    if (pb.authStore.isValid) await pb.collection('users').authRefresh()
    else pb.authStore.clear()
  } catch (error) {
    if ([401, 403, 404].includes(error?.status)) pb.authStore.clear()
    else authError.value = errorMessage(error)
  } finally {
    authUser.value = pb.authStore.isValid ? pb.authStore.record : null
    authReady.value = true
  }
}

export function useAuth() {
  async function signUp(email, password) {
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password })
    } catch (error) {
      throw new Error(errorMessage(error))
    }
    return signIn(email, password)
  }

  async function signIn(email, password) {
    try {
      await pb.collection('users').authWithPassword(email, password)
      authError.value = ''
    } catch (error) {
      if (error?.status === 400) throw new Error('Incorrect email or password.')
      throw new Error(errorMessage(error))
    }
  }

  function signOut() {
    pb.authStore.clear()
  }

  return { user: authUser, ready: authReady, error: authError, signUp, signIn, signOut }
}
