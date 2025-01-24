import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: sessionStorage.getItem('auth-token') || null,
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      sessionStorage.setItem('auth-token', token)
    },
    removeToken() {
      this.token = null
      sessionStorage.removeItem('auth-token')
    },
  },
  getters: {
    isSignedIn: (state) => {
      return !!state.token
    },
  },
})
