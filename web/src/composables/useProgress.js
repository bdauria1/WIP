import { reactive, ref, watch } from 'vue'
import { ALPHABET, STATIC_LETTERS } from '../data/letters'
import { authReady, authUser } from './useAuth'
import { pb, errorMessage } from '../lib/pocketbase'

const KEY = 'asl-progress-v1'

function emptyLetters() {
  const letters = {}
  for (const id of ALPHABET) {
    letters[id] = { hits: 0, misses: 0, confusions: {} }
  }
  return letters
}

function emptyState() {
  return { letters: emptyLetters(), wordsCompleted: 0, streak: 0 }
}

function normalizeState(parsed) {
  const letters = emptyLetters()
  for (const id of ALPHABET) {
    const row = parsed?.letters?.[id]
    if (!row) continue
    letters[id] = {
      hits: Number(row.hits) || 0,
      misses: Number(row.misses) || 0,
      confusions: row.confusions && typeof row.confusions === 'object' ? row.confusions : {},
    }
  }
  return {
    letters,
    wordsCompleted: Number(parsed?.wordsCompleted) || 0,
    streak: Number(parsed?.streak) || 0,
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    return normalizeState(JSON.parse(raw))
  } catch {
    return emptyState()
  }
}

const state = reactive(load())
const ready = ref(true)
const error = ref('')
let activeUserId = null
let recordId = null
let loadGeneration = 0
let pendingMutations = []
let saveTimer
let saveQueue = Promise.resolve()

function replaceState(next) {
  state.letters = next.letters
  state.wordsCompleted = next.wordsCompleted
  state.streak = next.streak
}

function scheduleSave() {
  if (!authReady.value || !ready.value) return
  if (!activeUserId) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
      error.value = ''
    } catch (saveError) {
      error.value = `Could not save browser progress: ${saveError.message}`
    }
    return
  }

  clearTimeout(saveTimer)
  const userId = activeUserId
  saveTimer = setTimeout(() => {
    saveQueue = saveQueue
      .catch(() => {})
      .then(async () => {
        if (activeUserId !== userId) return
        const progress = JSON.parse(JSON.stringify(state))
        if (recordId) {
          await pb.collection('user_progress').update(recordId, { progress })
        } else {
          let saved
          try {
            saved = await pb.collection('user_progress').create({ user: userId, progress })
          } catch (createError) {
            if (createError?.status !== 400) throw createError
            const existing = await pb
              .collection('user_progress')
              .getFirstListItem(pb.filter('user = {:userId}', { userId }))
            saved = await pb.collection('user_progress').update(existing.id, { progress })
          }
          if (activeUserId === userId) recordId = saved.id
        }
        if (activeUserId === userId) error.value = ''
      })
      .catch((saveError) => {
        if (activeUserId === userId) error.value = `Could not save progress: ${errorMessage(saveError)}`
      })
  }, 400)
}

function applyMutation(mutation) {
  if (mutation.type === 'reset') {
    replaceState(emptyState())
  } else if (mutation.type === 'word-complete') {
    state.wordsCompleted += 1
  } else {
    const row = state.letters[mutation.target]
    if (!row || !mutation.predicted) return
    if (mutation.predicted === mutation.target) {
      row.hits += 1
      state.streak += 1
    } else {
      row.misses += 1
      row.confusions[mutation.predicted] = (row.confusions[mutation.predicted] || 0) + 1
      state.streak = 0
    }
  }
}

async function loadUserProgress(userId, generation) {
  try {
    let record = null
    try {
      record = await pb
        .collection('user_progress')
        .getFirstListItem(pb.filter('user = {:userId}', { userId }))
    } catch (loadError) {
      if (loadError?.status !== 404) throw loadError
    }
    if (generation !== loadGeneration) return

    recordId = record?.id ?? null
    replaceState(record ? normalizeState(record.progress) : emptyState())
    for (const mutation of pendingMutations) applyMutation(mutation)
    pendingMutations = []
    ready.value = true
    scheduleSave()
  } catch (loadError) {
    if (generation !== loadGeneration) return
    error.value = `Could not load account progress: ${errorMessage(loadError)}`
  }
}

function refreshUserProgress() {
  if (!activeUserId) return
  const generation = ++loadGeneration
  ready.value = false
  error.value = ''
  loadUserProgress(activeUserId, generation)
}

watch(
  [authReady, authUser],
  ([isAuthReady, user]) => {
    if (!isAuthReady) return
    const userId = user?.id ?? null
    if (userId === activeUserId && ready.value) return
    activeUserId = userId
    recordId = null
    const generation = ++loadGeneration
    pendingMutations = []
    clearTimeout(saveTimer)
    error.value = ''

    if (userId) {
      ready.value = false
      replaceState(emptyState())
      loadUserProgress(userId, generation)
    } else {
      ready.value = true
      replaceState(load())
    }
  },
  { immediate: true, flush: 'sync' },
)

export function useProgress() {
  function recordAttempt({ target, predicted }) {
    const mutation = { type: 'attempt', target, predicted }
    applyMutation(mutation)
    if (activeUserId && !ready.value) pendingMutations.push(mutation)
    else scheduleSave()
  }

  function recordWordComplete() {
    const mutation = { type: 'word-complete' }
    applyMutation(mutation)
    if (activeUserId && !ready.value) pendingMutations.push(mutation)
    else scheduleSave()
  }

  function weakest(n = 5) {
    const ranked = STATIC_LETTERS.map((id) => {
      const row = state.letters[id]
      const total = row.hits + row.misses
      return { id, total, rate: total ? row.misses / total : -1 }
    })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.rate - a.rate || b.total - a.total)

    return ranked.slice(0, n).map((row) => row.id)
  }

  function topConfusion(id) {
    const entries = Object.entries(state.letters[id]?.confusions || {})
    if (!entries.length) return null
    entries.sort((a, b) => b[1] - a[1])
    return entries[0][0]
  }

  function reset() {
    const mutation = { type: 'reset' }
    applyMutation(mutation)
    if (activeUserId && !ready.value) pendingMutations.push(mutation)
    else scheduleSave()
  }

  return {
    state,
    ready,
    error,
    recordAttempt,
    recordWordComplete,
    weakest,
    topConfusion,
    reset,
    refreshUserProgress,
  }
}
