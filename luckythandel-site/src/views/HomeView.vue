<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { writeups, posts, news, research } from '../data/posts'
</script>

<template>
  <main>
    <section class="hero">
      <span class="kicker">~/luckythandel — NOW 300% FUNKIER ★ maximalism mode: ON</span>
      <h1>HTB <span class="spin-word">WALK-</span>THROUGHS, CTF CHAOS &amp; LOUD TUTORIALS!</h1>
      <p class="hero-sub">
        Yo! I'm <strong>Lucky Thandel</strong> — cybersecurity gremlin, sticker collector, professional
        over-enumerator. This site is my maximalist lab notebook: machine walkthroughs, CTF solutions,
        tutorials, hot takes, badges, stripes, sparkles — ALL OF IT, ALL AT ONCE. Minimalism left the chat.
      </p>
      <div class="hero-tags">
        <span class="badge">◉ {{ writeups.length }} write-ups &amp; counting</span>
        <span class="badge">⚡ enumerate everything</span>
        <span class="badge">★ beginner-friendly chaos</span>
        <span class="badge">▚ nmap-then-coffee</span>
        <span class="badge">☻ no beige allowed</span>
      </div>
    </section>

    <div class="terminal">nmap -sC -sV --min-rate 5000 target.htb # enumerate first, exploit second ★ then take notes like your life depends on it</div>

    <h2 class="section-title">✶ Latest HTB write-ups ✶</h2>
    <div class="grid">
      <article v-for="(w, i) in writeups" :key="w.slug" class="card">
        <span class="sticker-corner">{{ i === 0 ? '★ HOT!' : i === 1 ? '◉ FRESH' : '⚡ GOLD' }}</span>
        <span class="tag">{{ w.tag }}</span>
        <h3><RouterLink :to="`/writeups/${w.slug}`">{{ w.title }}</RouterLink></h3>
        <p>{{ w.summary }}</p>
        <div class="meta">{{ w.date }} ★ {{ w.level ?? 'all levels' }}</div>
      </article>
    </div>

    <div class="divider-marquee" aria-hidden="true">
      <div class="ticker-track">
        <span>⚡ NEW POSTS ⚡ NEW POSTS ⚡ NEW POSTS ⚡ NEW POSTS ⚡ NEW POSTS ⚡ NEW POSTS ⚡&nbsp;</span>
        <span>⚡ NEW POSTS ⚡ NEW POSTS ⚡ NEW POSTS ⚡ NEW POSTS ⚡ NEW POSTS ⚡ NEW POSTS ⚡&nbsp;</span>
      </div>
    </div>

    <h2 class="section-title alt">▚ Latest articles ▚</h2>
    <div class="grid">
      <article v-for="(p, i) in posts" :key="p.slug" class="card">
        <span class="sticker-corner">{{ i === 0 ? '✶ MUST-READ' : i === 1 ? '▚ KIT' : '◉ BRAIN-FOOD' }}</span>
        <span class="tag">{{ p.tag }}</span>
        <h3><RouterLink :to="`/articles/${p.slug}`">{{ p.title }}</RouterLink></h3>
        <p>{{ p.summary }}</p>
        <div class="meta">{{ p.date }} ★ article dept.</div>
      </article>
    </div>

    <h2 class="section-title">▲ Security news ▲</h2>
    <div class="grid">
      <article v-for="(n, i) in news" :key="n.slug" class="card">
        <span class="sticker-corner">{{ i === 0 ? '▲ BREAKING' : '★ BRIEF' }}</span>
        <span class="tag">{{ n.tag }}</span>
        <h3><RouterLink :to="`/articles/${n.slug}`">{{ n.title }}</RouterLink></h3>
        <p>{{ n.summary }}</p>
        <div class="meta">{{ n.date }} ★ news desk</div>
      </article>
    </div>

    <h2 class="section-title alt">◉ Fresh from the research lab ◉</h2>
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
