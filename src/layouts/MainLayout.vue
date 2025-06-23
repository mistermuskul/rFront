<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-dark text-white">
      <q-toolbar>

        <q-toolbar-title>
          Сайт-портфолио
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <q-btn
            v-if="isAdmin"
            flat
            round
            dense
            icon="person_add"
            class="q-mr-sm"
            @click="generateHRAccount"
          >
            <q-tooltip>Сгенерировать HR аккаунт</q-tooltip>
          </q-btn>

          <q-btn flat round dense icon="person" class="q-ml-sm">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

  

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="showHRAccountDialog" persistent>
      <q-card class="hr-account-dialog">
        <q-card-section class="dialog-header">
          <div class="text-h6">HR аккаунт создан</div>
        </q-card-section>

        <q-card-section class="dialog-content">
          <div class="account-info">
            <div class="info-item">
              <span class="label">Ссылка:</span>
              <span class="value">{{ hrAccountUrl }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ hrAccountEmail }}</span>
            </div>
            <div class="info-item">
              <span class="label">Пароль:</span>
              <span class="value">{{ hrAccountPassword }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat label="Закрыть" color="negative" v-close-popup class="action-btn" />
          <q-btn flat label="Скопировать ссылку" color="primary" @click="copyHRAccountUrl" class="action-btn" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { AxiosError } from 'axios'
import { ref, computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'

interface ApiErrorResponse {
  message: string;
  status?: number;
}

const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()

const showHRAccountDialog = ref(false)
const hrAccountUrl = ref('')
const hrAccountEmail = ref('')
const hrAccountPassword = ref('')

const isAdmin = computed(() => {
  return auth.user?.id === 1
})

const copyHRAccountUrl = () => {
  navigator.clipboard.writeText(hrAccountUrl.value)
  $q.notify({
    type: 'positive',
    message: 'Ссылка скопирована в буфер обмена'
  })
}

const generateHRAccount = async () => {
  if (!isAdmin.value) {
    $q.notify({
      type: 'negative',
      message: 'У вас нет прав для выполнения этого действия',
      position: 'top',
      timeout: 5000
    })
    return
  }

  try {
    const response = await api.post('/user/generate-hr')
    if (response.status === 201 && response.data.success) {
      const { uuid, email, password } = response.data
      const generatedUrl = `${window.location.origin}/admin/${uuid}`
      hrAccountUrl.value = generatedUrl
      hrAccountEmail.value = email
      hrAccountPassword.value = password
      showHRAccountDialog.value = true
    } else {
      throw new Error('Неожиданный формат ответа от сервера')
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    const errorMessage = axiosError.response?.data?.message || 
                        (axiosError.response?.status === 500 ? 'Внутренняя ошибка сервера' : 
                        'Ошибка при создании HR аккаунта')
    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 5000
    })
  }
}

const logout = () => {
  auth.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.hr-account-dialog {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  min-width: 400px;
  color: #ffffff;
}

.dialog-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
}

.dialog-header .text-h6 {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.dialog-content {
  padding: 1.5rem;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  color: #a8a8a8;
  font-size: 0.9rem;
}

.value {
  color: #ffffff;
  font-size: 1rem;
  word-break: break-all;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 4px;
}

.dialog-actions {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem 1.5rem;
}

.action-btn {
  font-weight: 500;
  text-transform: none;
  padding: 0.5rem 1rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Анимация появления диалога */
:deep(.q-dialog__backdrop) {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

:deep(.q-dialog__inner) {
  animation: dialogFadeIn 0.3s ease-out;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>