<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { news } from '../data/posts'
</script>

<template>
  <main>
    <section class="hero">
      <span class="kicker">/news — sourced briefs, defender takeaways ★ hot off the wire</span>
      <h1>SECURITY <span class="spin-word">NEWSWIRE!</span></h1>
      <p class="hero-sub">Short briefs on patches, advisories and techniques worth labbing — translated into human, served with sprinkles.</p>
    </section>
    <div class="grid">
      <article v-for="(n, i) in news" :key="n.slug" class="card">
        <span class="sticker-corner">{{ i === 0 ? '▲ BREAKING' : '★ BRIEF' }}</span>
        <span class="tag">{{ n.tag }}</span>
        <h3><RouterLink :to="`/articles/${n.slug}`">{{ n.title }}</RouterLink></h3>
        <p>{{ n.summary }}</p>
        <div class="meta">{{ n.date }} ★ news desk</div>
      </article>
    </div>
  </main>
</template>
