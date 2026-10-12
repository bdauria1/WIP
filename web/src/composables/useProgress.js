import { reactive, watch } from 'vue'
import { ALPHABET, STATIC_LETTERS } from '../data/letters'

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

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    const letters = emptyLetters()
    for (const id of ALPHABET) {
      const row = parsed.letters?.[id]
      if (!row) continue
      letters[id] = {
        hits: Number(row.hits) || 0,
        misses: Number(row.misses) || 0,
        confusions: row.confusions && typeof row.confusions === 'object' ? row.confusions : {},
      }
    }
    return {
      letters,
      wordsCompleted: Number(parsed.wordsCompleted) || 0,
      streak: Number(parsed.streak) || 0,
    }
  } catch {
    return emptyState()
  }
}

const state = reactive(load())

watch(
  state,
  () => {
    localStorage.setItem(KEY, JSON.stringify(state))
  },
  { deep: true },
)

export function useProgress() {
  function recordAttempt({ target, predicted }) {
    const row = state.letters[target]
    if (!row || !predicted) return
    if (predicted === target) {
      row.hits += 1
      state.streak += 1
    } else {
      row.misses += 1
      row.confusions[predicted] = (row.confusions[predicted] || 0) + 1
      state.streak = 0
    }
  }

  function recordWordComplete() {
    state.wordsCompleted += 1
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
    const next = emptyState()
    state.letters = next.letters
    state.wordsCompleted = 0
    state.streak = 0
  }

  return { state, recordAttempt, recordWordComplete, weakest, topConfusion, reset }
}
