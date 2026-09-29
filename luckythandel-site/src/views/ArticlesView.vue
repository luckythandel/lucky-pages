<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { posts } from '../data/posts'
</script>

<template>
  <main>
    <section class="hero">
      <span class="kicker">/articles — tutorials, ctf, mindset ★ extra loud</span>
      <h1>BLOG <span class="spin-word">ARCADE!</span> TUTORIALS &amp; HOT TAKES</h1>
      <p class="hero-sub">Short punchy posts: tooling I actually use, CTF lessons learned the hard way, and study routines that survive contact with reality.</p>
    </section>
    <div class="grid">
      <article v-for="(p, i) in posts" :key="p.slug" class="card">
        <span class="sticker-corner">{{ i === 0 ? '✶ FRESH INK' : '★ ARCHIVE GOLD' }}</span>
        <span class="tag">{{ p.tag }}</span>
        <h3><RouterLink :to="`/articles/${p.slug}`">{{ p.title }}</RouterLink></h3>
        <p>{{ p.summary }}</p>
        <div class="meta">{{ p.date }} ★ article dept.</div>
      </article>
    </div>
  </main>
</template>
