import { defineStore } from 'pinia'

interface UserInfo {
  id: string
  username: string
  role: string
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: '1',
      username: 'admin',
      role: 'admin',
      permissions: ['all']
    } as UserInfo,
    token: 'mock-token',
    currentShop: null as {
      id: string
      name: string
      platform: string
    } | null,
    sidebarCollapsed: false
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission: string) => {
      return state.userInfo?.permissions.includes(permission) || false
    }
  },
  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    },
    setCurrentShop(shop: { id: string; name: string; platform: string } | null) {
      this.currentShop = shop
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    }
  }
})