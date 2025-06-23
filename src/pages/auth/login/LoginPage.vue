<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section>
        <div class="text-h6">Вход в систему</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email обязателен']"
          />

          <q-input
            v-model="form.password"
            label="Пароль"
            type="password"
            :rules="[val => !!val || 'Пароль обязателен']"
          />

          <div>
            <q-btn 
              label="Войти" 
              type="submit" 
              color="primary" 
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import type { AxiosError } from 'axios'
import { useAuthStore } from 'src/stores/auth'

interface LoginForm {
  email: string
  password: string
}

interface ErrorResponse {
  message: string
}

const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()
const form = reactive<LoginForm>({
  email: '',
  password: ''
})

const onSubmit = async () => {
  try {
    await auth.login(form.email, form.password)
    $q.notify({
      type: 'positive',
      message: 'Успешный вход в систему',
      position: 'top'
    })
    router.push({ name: 'Dashboard' })
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>
    $q.notify({
      type: 'negative',
      message: axiosError.response?.data?.message || 'Ошибка авторизации',
      position: 'top'
    })
  }
}
const loading = computed(() => auth.loading)
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
}
</style> 