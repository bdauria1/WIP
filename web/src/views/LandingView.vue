<template>
  <div>
    <section class="relative overflow-hidden px-4 pb-20 pt-16 text-center sm:pt-24">
      <div class="sunburst opacity-60" aria-hidden="true"></div>
      <div class="relative mx-auto max-w-3xl">
        <p class="text-xs uppercase tracking-[0.5em] text-gold-dim">
          Fingerspelling in the browser
        </p>
        <h1 class="deco-title mt-5 text-4xl leading-tight sm:text-6xl">
          Learn the ASL alphabet with your webcam
        </h1>
        <div class="deco-rule mx-auto mt-8 max-w-md"><span></span></div>
        <p class="mx-auto mt-8 max-w-xl text-base leading-relaxed text-gold-dim sm:text-lg">
          Sign a letter and get instant feedback. Hand tracking runs entirely on your device,
          so you can practice anywhere without video ever leaving your browser.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <RouterLink to="/practice" class="deco-btn deco-btn-active w-full text-center sm:w-auto sm:px-8">
            {{ user ? 'Continue practicing' : 'Start practicing' }}
          </RouterLink>
          <RouterLink
            v-if="!user"
            :to="{ name: 'signin', query: { mode: 'signup' } }"
            class="deco-btn w-full text-center sm:w-auto sm:px-8"
          >
            Create free account
          </RouterLink>
          <RouterLink v-else to="/progress" class="deco-btn w-full text-center sm:w-auto sm:px-8">
            View my progress
          </RouterLink>
        </div>
        <p v-if="!user" class="mt-5 text-xs uppercase tracking-[0.2em] text-gold-dim/80">
          No account needed to try it.
          <RouterLink to="/signin" class="text-gold underline underline-offset-4 hover:text-glow">
            Sign in
          </RouterLink>
          to save your progress.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="features-heading">
      <h2 id="features-heading" class="deco-title text-center text-2xl sm:text-3xl">What you can do</h2>
      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="feature in features"
          :key="feature.to"
          :to="feature.to"
          class="deco-frame group block px-6 py-8 text-center transition hover:border-gold"
        >
          <p class="font-display text-4xl text-gold transition group-hover:text-glow">{{ feature.glyph }}</p>
          <h3 class="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">{{ feature.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-gold-dim">{{ feature.body }}</p>
        </RouterLink>
      </div>
    </section>

    <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6" aria-labelledby="how-heading">
      <h2 id="how-heading" class="deco-title text-center text-2xl sm:text-3xl">How it works</h2>
      <ol class="mt-10 grid gap-6 sm:grid-cols-3">
        <li v-for="(step, i) in steps" :key="step.title" class="text-center">
          <span
            class="mx-auto flex h-12 w-12 rotate-45 items-center justify-center border border-gold"
            aria-hidden="true"
          >
            <span class="-rotate-45 font-display text-lg text-gold">{{ i + 1 }}</span>
          </span>
          <h3 class="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-gold">{{ step.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-gold-dim">{{ step.body }}</p>
        </li>
      </ol>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div class="deco-frame px-6 py-10 text-center sm:px-10">
        <h2 class="deco-title text-2xl">Your camera stays private</h2>
        <p class="mt-5 text-sm leading-relaxed text-gold-dim">
          The hand landmark model and letter classifier run in your browser. When you sign in,
          only your scores and streaks are saved to your account. Never video or images.
        </p>
        <RouterLink to="/practice" class="deco-btn mt-8 inline-block px-8">
          Try it now
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()

const features = [
  { to: '/practice', glyph: 'A', title: 'Practice', body: 'Get a letter, sign it, and see if the model recognizes it.' },
  { to: '/spell', glyph: 'Ab', title: 'Spell', body: 'Fingerspell whole words one letter at a time.' },
  { to: '/alphabet', glyph: 'Z', title: 'Alphabet', body: 'Browse every handshape, including the letters that move.' },
  { to: '/progress', glyph: '★', title: 'Progress', body: 'Track your streak, hits and the letters you mix up.' },
]

const steps = [
  { title: 'Allow camera', body: 'Grant webcam access. Video is processed locally and never uploaded.' },
  { title: 'Sign a letter', body: 'Hold your hand in frame and form the handshape shown.' },
  { title: 'Get feedback', body: 'See what the model reads in real time and keep your streak going.' },
]
</script>
