import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRoles: (state) => state.user?.roles || [],
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      try {
        const response = await api.post('/auth/login', { email, password });
        this.token = response.data.token;
        localStorage.setItem('token', this.token!);
        await this.fetchUser();
        return true;
      } catch (error) {
        this.token = null;
        localStorage.removeItem('token');
        this.user = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async autoLogin(uuid: string) {
      this.loading = true;
      try {
        const response = await api.post(`/auth/auto-login/${uuid}`);
        if (response.data.success) {
          this.token = response.data.token;
          localStorage.setItem('token', this.token!);
          await this.fetchUser();
          return true;
        }
        return false;
      } catch (error) {
        this.token = null;
        localStorage.removeItem('token');
        this.user = null;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await api.get('/user');
        this.user = response.data.user;
      } catch (error) {
        this.logout();
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    hasRole(role: string) {
      return this.user?.roles?.includes(role) || false;
    },
  },
}); 