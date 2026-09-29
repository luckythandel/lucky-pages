<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { findPost } from '../data/posts'

const route = useRoute()
const post = computed(() => findPost(route.params.slug as string))
</script>

<template>
  <main class="prose article-body">
    <template v-if="post">
      <span class="kicker section-title">{{ post.tag }} · {{ post.date }}</span>
      <h1>{{ post.title }}</h1>
      <p class="article-meta">by Lucky Thandel · {{ post.date }}</p>
      <p v-for="(para, i) in post.body" :key="i">{{ para }}</p>
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
