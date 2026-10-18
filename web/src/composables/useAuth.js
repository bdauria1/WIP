import { ref } from 'vue'
import { supabase, supabaseConfigured } from '../lib/supabase'

export const authUser = ref(null)
export const authReady = ref(!supabaseConfigured)
export const authError = ref('')

let initialized = false

export async function initializeAuth() {
  if (initialized || !supabase) return
  initialized = true

  supabase.auth.onAuthStateChange((_event, session) => {
    authUser.value = session?.user ?? null
  })

  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      authError.value = error.message
    } else {
      authUser.value = data.session?.user ?? null
    }
  } catch (error) {
    authError.value = error.message
  } finally {
    authReady.value = true
  }
}

export function useAuth() {
  async function signUp(email, password) {
    if (!supabase) throw new Error('Account login is not configured yet.')
    return supabase.auth.signUp({ email, password })
  }

  async function signIn(email, password) {
    if (!supabase) throw new Error('Account login is not configured yet.')
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    if (!supabase) throw new Error('Account login is not configured yet.')
    return supabase.auth.signOut()
  }

  return { user: authUser, ready: authReady, error: authError, signUp, signIn, signOut }
}
