import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as string | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
  }),
  actions: {
    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.clearCredentials()
        throw new Error('No refresh token available')
      }

      try {
        const response = await fetch('/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        })

        if (!response.ok) {
          throw new Error('Failed to refresh token')
        }

        const { accessToken, refreshToken } = await response.json()
        this.accessToken = accessToken
        this.refreshToken = refreshToken

        sessionStorage.setItem(
          'user-credentials',
          JSON.stringify({
            userId: this.userId,
            accessToken,
            refreshToken,
          }),
        )
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.clearCredentials()
        throw new Error('Failed to refresh token. Please log in again.')
      }
    },

    async makeAuthenticatedRequest(input: RequestInfo, init?: RequestInit) {
      // eslint-disable-next-line no-useless-catch
      try {
        const headers = {
          ...init?.headers,
          Authorization: `Bearer ${this.accessToken}`,
        }

        const response = await fetch(input, { ...init, headers })

        if (response.status === 401) {
          try {
            await this.refreshAccessToken()

            const newHeaders = {
              ...init?.headers,
              Authorization: `Bearer ${this.accessToken}`,
            }

            return await fetch(input, { ...init, headers: newHeaders })
          } catch (refreshError) {
            this.clearCredentials()
            throw refreshError
          }
        }

        return response
      } catch (error) {
        throw error
      }
    },

    clearCredentials() {
      this.userId = null
      this.accessToken = null
      this.refreshToken = null
      sessionStorage.removeItem('user-credentials')
    },
  },
})
