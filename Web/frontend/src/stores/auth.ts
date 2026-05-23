import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import client from '@/api/client'

interface User {
  id: string
  username: string
  displayName: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    localStorage.setItem('token', t)
  }

  function setUser(u: User) {
    user.value = u
  }

  async function login(username: string, password: string) {
    const data: any = await client.post('/auth/login', { username, password })
    setToken(data.token)
    setUser(data.user)
  }

  async function register(username: string, password: string) {
    await client.post('/auth/register', { username, password })
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return { token, user, isLoggedIn, setToken, setUser, login, register, logout }
})
