<template>
  <form @submit.prevent="onSubmit" class="project-form">
    <div class="form-group">
      <label>Изображение</label>
      <div class="image-preview">
        <img :src="imageUrl" alt="Preview" v-if="imageUrl" />
        <div v-else class="no-image">Нет изображения</div>
      </div>
      <input type="file" accept="image/*" @change="onFileChange" />
    </div>
    <div class="form-group">
      <label>Название</label>
      <input v-model="form.title" required />
    </div>
    <div class="form-group">
      <label>Описание</label>
      <textarea v-model="form.description" rows="4" required></textarea>
    </div>
    <div class="form-group">
      <label>Порядок</label>
      <input type="number" v-model="form.order" required />
    </div>
    <div class="form-actions">
      <button type="submit" class="save-btn">Сохранить</button>
      <button type="button" class="cancel-btn" @click="$emit('cancel')">Отмена</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Project, ProjectForm } from '../model/project.model'

const props = defineProps<{
  project?: Project
}>()

const emit = defineEmits<{
  (e: 'submit', data: ProjectForm): void
  (e: 'cancel'): void
}>()

const form = ref<ProjectForm>({
  title: '',
  description: '',
  image: '',
  order: 0
})

const imageUrl = computed(() => {
  if (!form.value.image) return ''
  if (form.value.image.startsWith('http')) return form.value.image
  if (form.value.image.startsWith('data:image')) return form.value.image
  return `http://127.0.0.1:8000${form.value.image}`
})

onMounted(() => {
  if (props.project) {
    form.value = {
      title: props.project.title,
      description: props.project.description,
      image: props.project.image,
      order: props.project.order
    }
  }
})

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = ev => {
      form.value.image = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function onSubmit() {
  emit('submit', form.value)
}
</script>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(20, 20, 30, 0.98);
  border-radius: 12px;
  border: 1px solid #00ffb3;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #00ffb3;
  font-size: 1.1rem;
}

.form-group input,
.form-group textarea {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #00ffb3;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 1rem;
}

.image-preview {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #00ffb3;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 24px #00ffb3cc;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-preview img:hover {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  color: #666;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.save-btn,
.cancel-btn {
  padding: 0.7rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn {
  background: linear-gradient(90deg, #00ffb3, #00cfff);
  color: #18181f;
  border: none;
}

.save-btn:hover {
  background: linear-gradient(90deg, #00cfff, #00ffb3);
  color: #fff;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #00ffb3;
  color: #00ffb3;
}

.cancel-btn:hover {
  background: rgba(0, 255, 179, 0.1);
}
</style> 