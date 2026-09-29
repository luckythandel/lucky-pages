import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/articles', name: 'articles', component: () => import('../views/ArticlesView.vue') },
    { path: '/articles/:slug', name: 'article', component: () => import('../views/ArticleView.vue') },
    { path: '/writeups', name: 'writeups', component: () => import('../views/WriteupsView.vue') },
    { path: '/writeups/:slug', name: 'writeup', component: () => import('../views/ArticleView.vue') },
    { path: '/news', name: 'news', component: () => import('../views/NewsView.vue') },
    { path: '/research', name: 'research', component: () => import('../views/ResearchView.vue') },
    { path: '/research/:slug', name: 'research-detail', component: () => import('../views/ArticleView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  ],
})

export default router
