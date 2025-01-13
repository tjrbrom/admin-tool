import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    const savedCredentials = sessionStorage.getItem('user-credentials')
    if (savedCredentials) {
      const { userId, accessToken, refreshToken } = JSON.parse(savedCredentials)
      return { userId, accessToken, refreshToken }
    }
    return { userId: null, accessToken: null, refreshToken: null }
  },
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

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Failed to refresh token')
        }
        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken

        sessionStorage.setItem(
          'user-credentials',
          JSON.stringify({
            userId: this.userId,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
          }),
        )
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.clearCredentials()
        throw error
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
