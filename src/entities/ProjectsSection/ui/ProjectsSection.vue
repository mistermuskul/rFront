<template>
  <section class="projects-section">
    <h2 class="section-title projects-title">Проекты</h2>
    <div v-if="canEdit" class="edit-button">
      <q-btn
        color="primary"
        icon="settings"
        class="settings-btn"
        @click="showManager = true"
      />
    </div>
    <div class="slider-container">
      <div 
        class="slider" 
        @mouseenter="pauseAnimation" 
        @mouseleave="resumeAnimation"
        @wheel.prevent="handleWheel"
      >
        <div class="slider-track" :style="trackStyle">
          <div
            v-for="(project, index) in [...projects, ...projects, ...projects]"
            :key="`${project.id}-${index}`"
            class="slide"
            @click="openProjectDetails(project)"
          >
            <img :src="project.image" :alt="project.title" class="project-image" />
            <div class="project-info">
              <h3>{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="slider-gradient left"></div>
      <div class="slider-gradient right"></div>
    </div>

    <teleport to="body">
      <div v-if="showManager" class="modal-overlay" @click.self="showManager = false">
        <div class="modal-window">
          <button class="modal-close" @click="showManager = false">×</button>
          <ProjectsManager @projects-updated="onProjectsUpdated" />
        </div>
      </div>
    </teleport>

    <!-- Модальное окно с деталями проекта -->
    <teleport to="body">
      <q-dialog
        v-model="showProjectDetails"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="project-details-card">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ selectedProject?.title }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <img 
              v-if="selectedProject?.image" 
              :src="selectedProject.image" 
              :alt="selectedProject.title"
              class="project-details-image"
            />
            <p class="project-details-description">{{ selectedProject?.description }}</p>
          </q-card-section>
        </q-card>
      </q-dialog>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Project } from '../model/project.model'
import { projectApi } from '../api/project.api'
import ProjectsManager from './ProjectsManager.vue'
import { useAuthStore } from 'src/stores/auth'

const projects = ref<Project[]>([])
const position = ref(0)
const interval = ref<NodeJS.Timeout | null>(null)
const showManager = ref(false)
const isPaused = ref(false)
const isHovered = ref(false)
const showProjectDetails = ref(false)
const selectedProject = ref<Project | null>(null)

const auth = useAuthStore()

const trackStyle = computed(() => ({
  transform: `translateX(${position.value}px)`
}))

const canEdit = computed(() => {
  const roles = auth.userRoles
  return roles.includes('Admin') || roles.includes('SuperAdmin')
})

async function loadProjects() {
  try {
    const response = await projectApi.getProjects()
    projects.value = response.data
  } catch (error) {
    console.error('Error loading projects:', error)
  }
}

function animate() {
  if (!isPaused.value) {
    position.value -= 1
    const slideWidth = window.innerWidth 
    const totalWidth = slideWidth * projects.value.length
    
    if (position.value <= -totalWidth) {
      position.value = 0
    }
  }
}

function handleWheel(e: WheelEvent) {
  if (isHovered.value) {
    e.preventDefault()
    const scrollSpeed = 60
    position.value -= e.deltaY * scrollSpeed / 100
    
    const slideWidth = window.innerWidth
    const totalWidth = slideWidth * projects.value.length
    
    if (position.value <= -totalWidth) {
      position.value = 0
    } else if (position.value > 0) {
      position.value = -totalWidth
    }
  }
}

function pauseAnimation() {
  isPaused.value = true
  isHovered.value = true
}

function resumeAnimation() {
  isPaused.value = false
  isHovered.value = false
}

function onProjectsUpdated() {
  loadProjects()
}

function openProjectDetails(project: Project) {
  selectedProject.value = project
  showProjectDetails.value = true
}

onMounted(async () => {
  await loadProjects()
  interval.value = setInterval(animate, 20)
})

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value)
})
</script>

<style scoped>
.projects-section {
  margin: 4rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  /* border: 1px solid #00ffb3; */
 
  position: relative;
}

.projects-section::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 14px;
 
  z-index: -1;
  animation: borderGlow 3s linear infinite;
}

@keyframes borderGlow {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.projects-title {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.projects-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, transparent);
}

.edit-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
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

.slider-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(20, 20, 30, 0.3);
  backdrop-filter: blur(10px);
}

.slider {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 2rem 0;
}

.slider-track {
  display: flex;
  will-change: transform;
}

.slide {
  min-width: 100%;
  box-sizing: border-box;
  padding: 2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.slide:hover {
  transform: translateY(-4px);
}

.project-image {
  width: 100%;
  max-width: 800px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  margin-bottom: 1rem;
  border: 1px solid #00ffb3;
  transition: transform 0.3s ease;
  background: rgba(20, 20, 30, 0.98);
}

.project-image:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 32px 8px rgba(0, 255, 179, 0.2);
}

.project-info {
  text-align: center;
  padding: 1rem;
}

.project-info h3 {
  color: #00ffb3;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.project-description {
  color: #a8a8a8;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  line-height: 1.4;
}

.slider-gradient {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 300px;
  pointer-events: none;
  z-index: 2;
}

.slider-gradient.left {
  left: 0;
  background: linear-gradient(to right, 
    rgba(20, 20, 30, 1) 0%,
    rgba(20, 20, 30, 0.8) 20%,
    rgba(20, 20, 30, 0) 100%
  );
}

.slider-gradient.right {
  right: 0;
  background: linear-gradient(to left, 
    rgba(20, 20, 30, 1) 0%,
    rgba(20, 20, 30, 0.8) 20%,
    rgba(20, 20, 30, 0) 100%
  );
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-window {
  background: rgba(20, 20, 30, 0.98);
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid #00ffb3;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #00ffb3;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.project-details-card {
  width: 90%;
  max-width: 800px;
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid #00ffb3;
  border-radius: 12px;
  box-shadow: 0 0 32px 8px rgba(0, 255, 179, 0.2);
}

.project-details-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.project-details-description {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

:deep(.text-h6) {
  color: #00ffb3;
  font-size: 1.5rem;
  margin: 0;
}

:deep(.q-card__section) {
  padding: 1.5rem;
}

:deep(.q-btn) {
  color: #00ffb3;
}

:deep(.q-btn:hover) {
  color: #fff;
}

:deep(.q-dialog__backdrop) {
  background: rgba(0, 0, 0, 0.7);
}

:deep(.q-btn__content) {
  gap: 8px;
}

@media (max-width: 1200px) {
  .project-image {
    max-width: 100%;
    height: 250px;
  }
  
  .slider-gradient {
    width: 200px;
  }
}

@media (max-width: 900px) {
  .project-image {
    height: 200px;
  }
  
  .slider-gradient {
    width: 150px;
  }
}

@media (max-width: 600px) {
  .projects-section {
    padding: 1rem;
  }
  
  .project-image {
    height: 150px;
  }
  
  .slide {
    padding: 1rem 0.2rem;
  }
  
  .slider-gradient {
    width: 100px;
  }
  
  .project-details-card {
    width: 95%;
  }
  
  .project-details-image {
    max-height: 250px;
  }
  
  .project-details-description {
    font-size: 1rem;
  }
}
</style> 