<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { research } from '../data/posts'
</script>

<template>
  <main>
    <section class="hero">
      <span class="kicker">/research — original cyber experiments ★ the weird stuff lives here</span>
      <h1>CYBER <span class="spin-word">RESEARCH</span> LAB!</h1>
      <p class="hero-sub">
        Original experiments on unique things: honeypots, rogue Wi-Fi surveys, forensic artifact dives.
        Everything runs on gear I own or isolated labs, with defender takeaways attached. New findings
        drop here first — publish the weird, document the wonderful.
      </p>
      <div class="hero-tags">
        <span class="badge">◉ {{ research.length }} studies live</span>
        <span class="badge">⚡ original experiments</span>
        <span class="badge">★ defender takeaways</span>
        <span class="badge">▚ isolated labs only</span>
      </div>
    </section>
    <div class="grid">
      <article v-for="(r, i) in research" :key="r.slug" class="card">
        <span class="sticker-corner">{{ i === 0 ? '◉ NEW STUDY' : i === 1 ? '⚡ FIELDWORK' : '★ LAB NOTES' }}</span>
        <span class="tag">{{ r.tag }}</span>
        <h3><RouterLink :to="`/research/${r.slug}`">{{ r.title }}</RouterLink></h3>
        <p>{{ r.summary }}</p>
        <div class="meta">{{ r.date }} ★ research desk</div>
      </article>
    </div>
  </main>
</template>
