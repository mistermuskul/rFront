<template>
  <div class="projects-manager">
    <div class="header">
      <h2>Управление проектами</h2>
      <button class="add-btn" @click="showAddModal = true">
        <q-icon name="add" />
        Добавить проект
      </button>
    </div>

    <div v-if="isLoading" class="loading-container">
      <q-spinner-dots color="primary" size="3em" />
      <span class="loading-text">Загрузка проектов...</span>
    </div>

    <div v-else class="projects-list">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <img :src="project.image" :alt="project.title" class="project-image" />
        <div class="project-info">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="project-actions">
            <button class="edit-btn" @click="editProject(project)" :disabled="isSaving">
              <q-icon name="edit" />
              Редактировать
            </button>
            <button class="delete-btn" @click="showDeleteDialog(project)" :disabled="isDeleting">
              <q-icon name="delete" />
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <q-dialog
        v-model="showDialog"
        persistent
        maximized
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="modal-card">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ editingProject ? 'Редактировать проект' : 'Добавить проект' }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="closeModal" :disabled="isSaving" />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <ProjectForm
              :project="editingProject"
              :loading="isSaving"
              @submit="onProjectSaved"
              @cancel="closeModal"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </teleport>

    <!-- Модальное окно подтверждения удаления -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card class="delete-dialog">
        <q-card-section class="row items-center">
          <div class="text-h6">Подтверждение</div>
        </q-card-section>

        <q-card-section>
          Вы уверены, что хотите удалить этот проект?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn flat label="Удалить" color="negative" @click="confirmDelete" :loading="isDeleting" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { Project, ProjectForm as ProjectFormType } from '../model/project.model'
import { projectApi } from '../api/project.api'
import ProjectForm from './ProjectForm.vue'

const emit = defineEmits<{
  (e: 'projects-updated'): void
}>()

const $q = useQuasar()
const projects = ref<Project[]>([])
const showAddModal = ref(false)
const editingProject = ref<Project | undefined>(undefined)
const isLoading = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)
const projectToDelete = ref<Project | null>(null)

const showDialog = computed({
  get: () => showAddModal.value || !!editingProject.value,
  set: (value) => {
    if (!value) {
      closeModal()
    }
  }
})

onMounted(async () => {
  await loadProjects()
})

async function loadProjects() {
  isLoading.value = true
  try {
    const response = await projectApi.getProjects()
    projects.value = response.data
  } catch (error) {
    console.error('Error loading projects:', error)
    $q.notify({
      type: 'negative',
      message: 'Ошибка загрузки проектов'
    })
  } finally {
    isLoading.value = false
  }
}

function editProject(project: Project) {
  editingProject.value = project
}

function showDeleteDialog(project: Project) {
  projectToDelete.value = project
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (!projectToDelete.value) return

  try {
    isDeleting.value = true
    await projectApi.deleteProject(projectToDelete.value.id)
    projects.value = projects.value.filter(p => p.id !== projectToDelete.value?.id)
    emit('projects-updated')
    showDeleteConfirm.value = false
    $q.notify({
      type: 'positive',
      message: 'Проект успешно удален'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    $q.notify({
      type: 'negative',
      message: 'Ошибка удаления проекта'
    })
  } finally {
    isDeleting.value = false
    projectToDelete.value = null
  }
}

async function onProjectSaved(data: ProjectFormType) {
  isSaving.value = true
  try {
    if (editingProject.value) {
      await projectApi.updateProject(editingProject.value.id, data)
    } else {
      await projectApi.createProject(data)
    }
    await loadProjects()
    closeModal()
    emit('projects-updated')
    $q.notify({
      type: 'positive',
      message: `Проект успешно ${editingProject.value ? 'обновлен' : 'добавлен'}`
    })
  } catch (error) {
    console.error('Error saving project:', error)
    $q.notify({
      type: 'negative',
      message: 'Ошибка сохранения проекта'
    })
  } finally {
    isSaving.value = false
  }
}

function closeModal() {
  showAddModal.value = false
  editingProject.value = undefined
}
</script>

<style scoped>
.projects-manager {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  color: #00ffb3;
  margin: 0;
  font-size: 1.5rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(90deg, #00ffb3, #00cfff);
  color: #18181f;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: linear-gradient(90deg, #00cfff, #00ffb3);
  color: #fff;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.projects-list::-webkit-scrollbar {
  display: none;
}

.project-card {
  background: rgba(20, 20, 30, 0.98);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #00ffb3;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
}

.project-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.project-info {
  padding: 1rem;
}

.project-info h3 {
  color: #00ffb3;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.project-info p {
  color: #a8a8a8;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: transparent;
  border: 1px solid #00ffb3;
  color: #00ffb3;
}

.edit-btn:hover {
  background: rgba(0, 255, 179, 0.1);
}

.delete-btn {
  background: transparent;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
}

.delete-btn:hover {
  background: rgba(255, 77, 77, 0.1);
}

.modal-card {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid #00ffb3;
  border-radius: 12px;
  box-shadow: 0 0 32px 8px rgba(0, 255, 179, 0.2);
}

:deep(.q-dialog__backdrop) {
  background: rgba(0, 0, 0, 0.7);
}

:deep(.q-card__section) {
  padding: 1.5rem;
}

:deep(.text-h6) {
  color: #00ffb3;
  font-size: 1.5rem;
  margin: 0;
}

:deep(.q-btn) {
  color: #00ffb3;
}

:deep(.q-btn:hover) {
  color: #fff;
}

@media (max-width: 768px) {
  .modal-window {
    padding: 1.5rem;
  }
  
  .projects-list {
    grid-template-columns: 1fr;
  }
  
  .project-image {
    height: 140px;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
}

.loading-text {
  color: #00ffb3;
  font-size: 1.1rem;
}

.edit-btn:disabled,
.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-dialog {
  min-width: 350px;
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid #00ffb3;
  border-radius: 12px;
}

.delete-dialog :deep(.q-card__section) {
  color: #fff;
}

.delete-dialog :deep(.text-h6) {
  color: #00ffb3;
  font-size: 1.2rem;
  margin: 0;
}

.delete-dialog :deep(.q-btn) {
  color: #00ffb3;
}

.delete-dialog :deep(.q-btn:hover) {
  color: #fff;
}
</style> 