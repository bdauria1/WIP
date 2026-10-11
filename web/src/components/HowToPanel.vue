<template>
  <details class="deco-frame group p-5" open>
    <summary
      class="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.35em]"
    >
      How to play
      <span class="text-gold-dim transition group-open:rotate-180">⌄</span>
    </summary>

    <ol
      class="mt-5 list-[upper-roman] space-y-2 pl-6 text-sm tracking-wide text-gold/80 marker:text-amber"
    >
      <li>Allow camera access when your browser asks.</li>
      <li>Hold one hand in frame with good lighting.</li>
      <li>Make an ASL letter and hold it steady until it locks in.</li>
      <li>Lower your hand briefly to sign the same letter twice, like the L's in HELLO.</li>
    </ol>

    <p class="mt-5 text-xs leading-relaxed text-gold-dim">
      J and Z involve motion, so they won't be reliable yet. Need a refresher?
      <a
        href="https://www.lifeprint.com/asl101/fingerspelling/abc.htm"
        target="_blank"
        rel="noopener"
        class="text-amber underline-offset-2 hover:underline"
      >
        See an ASL fingerspelling chart
      </a>.
    </p>
  </details>
</template>