<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { findPost, type Block } from '../data/posts'

const route = useRoute()
const post = computed(() => findPost(route.params.slug as string))
const base = import.meta.env.BASE_URL

function blockKey(b: Block, i: number): string {
  return `${b.kind}-${i}`
}

async function copyCode(event: MouseEvent, code: string) {
  const btn = event.currentTarget as HTMLButtonElement
  try {
    await navigator.clipboard.writeText(code)
    const orig = btn.textContent
    btn.textContent = '✓ copied'
    setTimeout(() => (btn.textContent = orig), 1500)
  } catch {
    btn.textContent = 'select + ctrl+c'
    setTimeout(() => (btn.textContent = '⧉ copy'), 1500)
  }
}
</script>

<template>
  <main class="prose article-body">
    <template v-if="post">
      <span class="kicker section-title">{{ post.tag }} · {{ post.date }}</span>
      <h1>{{ post.title }}</h1>
      <p class="article-meta">by Lucky Thandel · {{ post.date }}</p>
      <template v-if="post.blocks && post.blocks.length">
        <template v-for="(b, i) in post.blocks" :key="blockKey(b, i)">
          <p v-if="b.kind === 'p'">{{ b.text }}</p>
          <h2 v-else-if="b.kind === 'h'" class="walkthrough-h">{{ b.text }}</h2>
          <div v-else-if="b.kind === 'code'" class="codeblock">
            <div class="codeblock-bar">
              <span class="codeblock-title">{{ b.title ?? b.lang ?? 'terminal' }}</span>
              <button class="copy-btn" @click="copyCode($event, b.code)">⧉ copy</button>
            </div>
            <pre><code>{{ b.code }}</code></pre>
          </div>
          <figure v-else-if="b.kind === 'img'" class="post-figure">
            <img :src="base + b.src" :alt="b.alt" loading="lazy" />
            <figcaption v-if="b.caption">{{ b.caption }}</figcaption>
          </figure>
        </template>
      </template>
      <template v-else>
        <p v-for="(para, i) in post.body" :key="i">{{ para }}</p>
      </template>
      <div class="divider-marquee" aria-hidden="true">
        <div class="ticker-track">
          <span>★ END OF TRANSMISSION ★ GO HACK SOMETHING (LEGALLY) ★ DOCUMENT EVERYTHING ★&nbsp;</span>
          <span>★ END OF TRANSMISSION ★ GO HACK SOMETHING (LEGALLY) ★ DOCUMENT EVERYTHING ★&nbsp;</span>
        </div>
      </div>
      <p><RouterLink to="/">← Back to home</RouterLink></p>
    </template>
    <template v-else>
      <h1>Not found</h1>
      <p>No article with this slug exists yet.</p>
      <p><RouterLink to="/">← Back to home</RouterLink></p>
    </template>
  </main>
</template>
