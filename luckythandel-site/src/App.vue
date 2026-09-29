<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      <span>★ FUNKY MAXIMALISM EDITION ★ HTB WRITE-UPS ★ CTF CHAOS ★ ARTICLES ★ NEWS ★ MORE IS MORE ★ NO GREEN ALLOWED ★</span>
      <span>★ FUNKY MAXIMALISM EDITION ★ HTB WRITE-UPS ★ CTF CHAOS ★ ARTICLES ★ NEWS ★ MORE IS MORE ★ NO GREEN ALLOWED ★</span>
    </div>
  </div>

  <div class="topbar">
    <div class="brand">
      <div class="brand-mark">LT!</div>
      <div class="brand-name">
        Lucky★Thandel
        <small>⚡ hacky • funky • write-up party ⚡</small>
      </div>
    </div>
    <nav class="main-nav">
      <RouterLink to="/">✶ Home</RouterLink>
      <RouterLink to="/articles">▚ Articles</RouterLink>
      <RouterLink to="/writeups">◉ HTB Write-ups</RouterLink>
      <RouterLink to="/news">▲ News</RouterLink>
      <RouterLink to="/research">◉ Research</RouterLink>
      <RouterLink to="/about">☻ About</RouterLink>
    </nav>
  </div>

  <RouterView />

  <div class="divider-marquee pink" aria-hidden="true">
    <div class="ticker-track">
      <span>✶ READ ✶ HACK ✶ REPEAT ✶ DOCUMENT EVERYTHING ✶ ENUMERATE FIRST ✶ EXPLOIT SECOND ✶ READ ✶ HACK ✶ REPEAT ✶&nbsp;</span>
      <span>✶ READ ✶ HACK ✶ REPEAT ✶ DOCUMENT EVERYTHING ✶ ENUMERATE FIRST ✶ EXPLOIT SECOND ✶ READ ✶ HACK ✶ REPEAT ✶&nbsp;</span>
    </div>
  </div>

  <div class="footer">
    <span><span class="foot-pop">LUCKYTHANDEL</span> — funky security notes by Lucky Thandel ★ est. 2026</span>
    <span>vue + github pages ★ maximalism forever ★ no beige allowed</span>
  </div>
</template>
