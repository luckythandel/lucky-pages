<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { writeups } from '../data/posts'
</script>

<template>
  <main>
    <section class="hero">
      <span class="kicker">/writeups — every box documented ★ no gatekeeping</span>
      <h1>HTB MACHINE <span class="spin-word">WRITE-UPS!</span></h1>
      <p class="hero-sub">
        Step-by-step chaos: enumeration → foothold → privilege escalation, with all the wrong turns
        left in so you learn faster. Educational walkthroughs of retired lab machines. Bring snacks.
      </p>
      <div class="hero-tags">
        <span class="badge">★ methodology included</span>
        <span class="badge">⚡ commands you can steal</span>
        <span class="badge">◉ beginner-safe</span>
      </div>
    </section>
    <div class="grid">
      <article v-for="(w, i) in writeups" :key="w.slug" class="card">
        <span class="sticker-corner">{{ i === 0 ? '★ START HERE' : '⚡ LAB' }}</span>
        <span class="tag">{{ w.tag }}</span>
        <h3><RouterLink :to="`/writeups/${w.slug}`">{{ w.title }}</RouterLink></h3>
        <p>{{ w.summary }}</p>
        <div class="meta">{{ w.date }} ★ {{ w.level ?? 'all levels' }}</div>
      </article>
    </div>
  </main>
</template>
