<template>
     <section class="hero-section">
        <div class="hero-content">
          <div class="avatar-container">
            <div class="avatar-wrapper" @click="showModal = true">
              <img :src="avatarUrl" :alt="hero.fullName" class="avatar" />
              <div class="avatar-glow"></div>
              <div class="zoom-icon">
                <q-icon name="zoom_in" size="2rem" />
              </div>
            </div>
          </div>
          <h1 class="name">{{ hero.fullName }}</h1>
          <h2 class="title">{{ hero.specialization }}</h2>
          <p class="bio">{{ hero.bio }}</p>
          <div v-if="canEdit" class="edit-button">
            <q-btn
              color="primary"
              icon="settings"
              class="settings-btn"
              @click="showEditModal = true"
            />
          </div>
        </div>
        <teleport to="body">
          <div v-if="showModal && !editMode" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-window">
              <button class="modal-close" @click="showModal = false">×</button>
              <img
                :src="avatarUrl"
                :alt="hero.fullName"
                class="modal-avatar"
                @click.stop="showAvatarFullscreen = true"
                style="cursor: zoom-in;"
              />
              <div class="modal-info">
                <h2>{{ hero.fullName }}</h2>
                <ul>
                  <li><strong>Возраст:</strong> {{ age }} {{ pluralizeYear(age) }}</li>
                  <li><strong>Дата рождения:</strong> {{ birthDateString }}</li>
                  <li><strong>Город:</strong> {{ hero.city }}</li>
                  <li><strong>Образование:</strong> {{ hero.education }}</li>
                  <li><strong>Специализация:</strong> {{ hero.specialization }}</li>
                  <li><strong>Основной стек:</strong> {{ hero.stack }}</li>
                  <li><strong>Опыт работы:</strong> {{ experience }}</li>
                </ul>
              </div>
            </div>
          </div>
        </teleport>
        <teleport to="body">
          <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
            <div class="modal-window edit-window">
              <button class="modal-close" @click="showEditModal = false">×</button>
              <form @submit.prevent="onSubmit">
                <div class="edit-avatar-block">
                  <img :src="form.avatar" alt="avatar" class="modal-avatar" />
                  <input type="file" accept="image/*" @change="onFileChange" />
                </div>
                <div class="edit-fields">
                  <input v-model="form.fullName" placeholder="ФИО" required />
                  <input v-model="form.birthDate" type="date" placeholder="Дата рождения" required />
                  <input v-model="form.city" placeholder="Город" required />
                  <input v-model="form.education" placeholder="Образование" required />
                  <input v-model="form.specialization" placeholder="Специализация" required />
                  <input v-model="form.stack" placeholder="Основной стек" required />
                  <input v-model="form.experienceStart" type="date" placeholder="Начало опыта" required />
                  <textarea v-model="form.bio" placeholder="Bio" rows="2" />
                </div>
                <button class="save-btn" type="submit">Сохранить</button>
              </form>
            </div>
          </div>
        </teleport>
        <teleport to="body">
          <div v-if="showAvatarFullscreen" class="fullscreen-avatar-overlay" @click.self="showAvatarFullscreen = false">
            <button class="fullscreen-close" @click="showAvatarFullscreen = false">×</button>
            <img
              :src="avatarUrl"
              :alt="hero.fullName"
              class="fullscreen-avatar"
            />
          </div>
        </teleport>
      </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { HeroInfo, ServerHeroInfo } from '../model/hero.model'
import { getHeroInfo, updateHeroInfo } from '../api/hero.api'
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()
const showModal = ref(false)
const showAvatarFullscreen = ref(false)
const showEditModal = ref(false)
const editMode = ref(false)
const hero = ref<HeroInfo>({
  avatar: '',
  fullName: '',
  birthDate: '',
  city: '',
  education: '',
  specialization: '',
  stack: '',
  experienceStart: '',
  bio: '',
})

const form = ref<HeroInfo>({ ...hero.value })

const avatarUrl = computed(() => {
  if (!hero.value.avatar) return ''
  if (hero.value.avatar.startsWith('http')) return hero.value.avatar
  return `http://127.0.0.1:8000${hero.value.avatar}`
})

const emit = defineEmits(['update:avatar'])

watch(avatarUrl, (newAvatar) => {
  emit('update:avatar', newAvatar)
}, { immediate: true })

function convertServerToClient(data: ServerHeroInfo): HeroInfo {
  return {
    avatar: data.avatar,
    fullName: data.full_name,
    birthDate: data.birth_date,
    city: data.city,
    education: data.education,
    specialization: data.specialization,
    stack: data.stack,
    experienceStart: data.experience_start,
    bio: data.bio
  }
}

function convertClientToServer(data: HeroInfo): ServerHeroInfo {
  return {
    avatar: data.avatar,
    full_name: data.fullName,
    birth_date: data.birthDate,
    city: data.city,
    education: data.education,
    specialization: data.specialization,
    stack: data.stack,
    experience_start: data.experienceStart,
    bio: data.bio
  }
}

onMounted(async () => {
  const data = await getHeroInfo()
  hero.value = convertServerToClient(data)
  form.value = { ...hero.value }
})

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = ev => {
      form.value.avatar = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const now = new Date()
const birthDateString = computed(() => {
  if (!hero.value.birthDate) return ''
  const d = new Date(hero.value.birthDate)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
})

const age = computed(() => {
  if (!hero.value.birthDate) return 0
  const birthDate = new Date(hero.value.birthDate)
  let age = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--
  }
  return age
})

function pluralizeYear(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return 'год'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'года'
  return 'лет'
}

function pluralizeMonth(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return 'месяц'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'месяца'
  return 'месяцев'
}

const experience = computed(() => {
  if (!hero.value.experienceStart) return ''
  const start = new Date(hero.value.experienceStart)
  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  
  if (months < 0) {
    years--
    months += 12
  }
  
  if (now.getDate() < start.getDate()) {
    months--
    if (months < 0) {
      years--
      months += 12
    }
  }

  let result = ''
  if (years > 0) {
    result += years + ' ' + pluralizeYear(years)
  }
  if (months > 0) {
    if (result) result += ' '
    result += months + ' ' + pluralizeMonth(months)
  }
  if (!result) result = 'меньше месяца'
  return result
})

const canEdit = computed(() => {
  const roles = auth.userRoles
  return roles.includes('Admin') || roles.includes('SuperAdmin')
})

const onSubmit = async () => {
  try {
    await updateHeroInfo(convertClientToServer(form.value))
    const updated = await getHeroInfo()
    hero.value = convertServerToClient(updated)
    showEditModal.value = false
  } catch (error) {
    console.error('Error updating hero:', error)
  }
}
</script>

<style scoped>
.hero-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.avatar-container {
  margin-bottom: 2rem;
}

.avatar-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  box-shadow:
    0 0 32px 8px #00ffb3cc,
    0 0 0 6px rgba(0,255,179,0.2),
    0 4px 30px rgba(0,0,0,0.18);
  border-radius: 50%;
  border: 2px solid #00ffb3;
  filter: blur(0.2px);
  cursor: pointer;
  transition: transform 0.3s ease;
  animation: borderPulse 2s ease-in-out infinite;
}

@keyframes borderPulse {
  0% {
    box-shadow:
      0 0 32px 8px #00ffb3cc,
      0 0 0 6px rgba(0,255,179,0.2),
      0 4px 30px rgba(0,0,0,0.18);
    border-color: #00ffb3;
  }
  50% {
    box-shadow:
      0 0 48px 12px #00ffb3cc,
      0 0 0 8px rgba(0,255,179,0.3),
      0 4px 30px rgba(0,0,0,0.18);
    border-color: #00e6a3;
  }
  100% {
    box-shadow:
      0 0 32px 8px #00ffb3cc,
      0 0 0 6px rgba(0,255,179,0.2),
      0 4px 30px rgba(0,0,0,0.18);
    border-color: #00ffb3;
  }
}

.avatar-wrapper:hover {
  transform: scale(1.05);
  animation: none;
  box-shadow:
    0 0 48px 12px #00ffb3cc,
    0 0 0 8px rgba(0,255,179,0.3),
    0 4px 30px rgba(0,0,0,0.18);
  border-color: #00e6a3;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 24px #00ffb3cc, 0 0 0 2px #00ffb3;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  z-index: -1;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    opacity: 0.5;
    transform: scale(1);
  }
  to {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.name {
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #ffffff, #a8a8a8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  padding-bottom: 0.5rem;
}

.name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, transparent);
}

.title {
  font-size: 2rem;
  color: #a8a8a8;
  margin: 1rem 0;
  background: linear-gradient(45deg, #ffffff, #a8a8a8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bio {
  font-size: 1.2rem;
  color: #888;
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(45deg, #ffffff, #a8a8a8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .name {
    font-size: 3rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s;
}
.modal-window {
  background: rgba(20, 20, 30, 0.98);
  border-radius: 24px;
  box-shadow:
    0 0 32px 8px #00ffb3cc,
    0 0 0 6px rgba(0,255,179,0.2),
    0 4px 30px rgba(0,0,0,0.18);
  border: 2px solid #00ffb3;
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 400px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  color: #fff;
  position: relative;
  text-align: left;
  animation: modalPop 0.3s;
  backdrop-filter: blur(10px);
  scrollbar-width: none; 
  -ms-overflow-style: none; 
}

.modal-window::-webkit-scrollbar {
  display: none;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 18px;
  background: none;
  border: none;
  color: #00ffb3;
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;
}
.modal-close:hover {
  color: #fff;
}
.modal-avatar {
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 0 auto 1.2rem auto;
  border: 3px solid #00ffb3;
  box-shadow: 0 0 24px #00ffb3cc;
  object-fit: cover;
}
.modal-info {
  margin-top: 0.5rem;
}
.modal-info h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #00ffb3;
  background: linear-gradient(45deg, #00ffb3, #00cfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.modal-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.modal-info li {
  margin-bottom: 0.5rem;
  font-size: 1.08rem;
  background: linear-gradient(45deg, #ffffff, #a8a8a8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.9;
}
.modal-info li strong {
  color: #00ffb3;
  background: none;
  -webkit-text-fill-color: initial;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalPop {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.fullscreen-avatar-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.95);
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s;
}
.fullscreen-avatar {
  width: 80vw;
  height: 80vw;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 50%;
  border: 6px solid #00ffb3;
  box-shadow:
    0 0 64px 16px #00ffb3cc,
    0 0 0 12px rgba(0,255,179,0.2),
    0 8px 60px rgba(0,0,0,0.18);
  object-fit: cover;
  background: #111;
  animation: modalPop 0.3s;
}
.fullscreen-close {
  position: fixed;
  top: 32px;
  right: 48px;
  background: none;
  border: none;
  color: #00ffb3;
  font-size: 3rem;
  cursor: pointer;
  z-index: 20001;
  transition: color 0.2s;
}
.fullscreen-close:hover {
  color: #fff;
}

.settings-btn {
  background: linear-gradient(90deg, #00ffb3, #00e6a3) !important;
  color: #18181f !important;
  border: none !important;
  transition: all 0.3s ease !important;
}

.settings-btn:hover {
  background: linear-gradient(90deg, #00e6a3, #00ffb3) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 255, 179, 0.3);
}

:deep(.q-btn__content) {
  gap: 8px;
}

.edit-window form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}
.edit-avatar-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.edit-avatar-block input[type="file"] {
  margin-top: 0.5rem;
}
.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.edit-fields input,
.edit-fields textarea {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #00ffb3;
  background: #18181f;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.edit-fields input:focus,
.edit-fields textarea:focus {
  border: 1.5px solid #00ffb3;
}
.save-btn {
  background: linear-gradient(90deg, #00ffb3, #00cfff);
  color: #18181f;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 0 16px #00ffb3cc;
  transition: background 0.2s, color 0.2s;
}
.save-btn:hover {
  background: linear-gradient(90deg, #00cfff, #00ffb3);
  color: #fff;
}

.edit-button {
  margin-top: 2rem;
}

.zoom-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #00ffb3;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrapper:hover .zoom-icon {
  opacity: 1;
}

.avatar-wrapper:hover .avatar {
  filter: brightness(0.7);
}
</style>