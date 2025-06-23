<template>
  <div 
    v-if="isVisible" 
    class="animated-animal"
    :class="position"
    @click="hideAnimal"
  >
    <div class="animal-container">
      <slot></slot>
      <div class="speech-bubble">
        {{ props.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent } from 'vue'

const props = defineProps<{
  message: string
}>()

const emit = defineEmits<{
  (e: 'hide'): void
}>()

const isVisible = ref(false)
const position = ref('')

const positions = ['top-center', 'top-center-right', 'top-center-left']

const showAnimal = () => {
  position.value = positions[Math.floor(Math.random() * positions.length)]
  isVisible.value = true
}

const hideAnimal = () => {
  isVisible.value = false
  emit('hide')
}

onMounted(() => {
  setTimeout(showAnimal, 10000)
})

defineComponent({
  name: 'AnimatedAnimal'
})
</script>

<style scoped>
.animated-animal {
  position: fixed;
  z-index: 1000;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.animated-animal:hover {
  transform: scale(1.1);
}

.animal-container {
  position: relative;
  width: 250px;
  height: 150px;
}

.speech-bubble {
  position: absolute;
  background: white;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  animation: bounce 1s infinite;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  border: 10px solid transparent;
}

/* Position-specific styles */
.top-center {
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
}

.top-center .speech-bubble {
  left: -50%;
  bottom: 100%;
  transform: translateX(-50%);
  margin-bottom: 10px;
}

.top-center .speech-bubble::after {
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border-top-color: white;
}

.top-center-right {
  top: 20%;
  right: 20%;
}

.top-center-right .speech-bubble {
    right: 89%;
    top: 19%;
  transform: translateY(-50%);
  margin-right: 10px;
}

.top-center-right .speech-bubble::after {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: white;
}

.top-center-left {
  top: 20%;
  left: 20%;
}

.top-center-left .speech-bubble {
    left: 72%;
    top: 23%;
  transform: translateY(-50%);
  margin-left: 10px;
}

.top-center-left .speech-bubble::after {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: white;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Update hover effect for new positioning */
.top-center:hover {
  transform: translateX(-50%) scale(1.1);
}

.top-center-right:hover,
.top-center-left:hover {
  transform: scale(1.1);
}
</style> 