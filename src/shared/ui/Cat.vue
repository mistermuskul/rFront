<template>
  <AnimatedAnimal :message="message" @hide="$emit('hide')">
    <svg class="cat" viewBox="0 0 250 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Cat body -->
      <path class="cat-body" d="M100,120 C130,120 150,100 150,70 C150,40 130,20 100,20 C70,20 50,40 50,70 C50,100 70,120 100,120" />
      
      <!-- Cat ears -->
      <path class="cat-ear left" d="M70,40 L50,10 L90,30 Z" />
      <path class="cat-ear right" d="M130,40 L150,10 L110,30 Z" />
      
      <!-- Cat eyes -->
      <circle class="cat-eye left" cx="80" cy="60" r="8" />
      <circle class="cat-eye right" cx="120" cy="60" r="8" />
      
      <!-- Cat nose -->
      <path class="cat-nose" d="M95,75 L105,75 L100,85 Z" />
      
      <!-- Cat mouth -->
      <path class="cat-mouth" d="M90,90 Q100,100 110,90" />
      
      <!-- Cat whiskers -->
      <line class="cat-whisker" x1="60" y1="80" x2="30" y2="75" />
      <line class="cat-whisker" x1="60" y1="85" x2="30" y2="85" />
      <line class="cat-whisker" x1="60" y1="90" x2="30" y2="95" />
      <line class="cat-whisker" x1="140" y1="80" x2="170" y2="75" />
      <line class="cat-whisker" x1="140" y1="85" x2="170" y2="85" />
      <line class="cat-whisker" x1="140" y1="90" x2="170" y2="95" />

      <!-- Waving paw -->
      <g class="paw" transform="translate(180, 90)">
        <path class="paw-pad" d="M0,0 C5,-5 10,-5 15,0 C20,5 20,10 15,15 C10,20 5,20 0,15 C-5,10 -5,5 0,0" />
        <circle class="paw-toe" cx="5" cy="5" r="3" />
        <circle class="paw-toe" cx="10" cy="0" r="3" />
        <circle class="paw-toe" cx="15" cy="5" r="3" />
      </g>
    </svg>
  </AnimatedAnimal>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import AnimatedAnimal from './AnimatedAnimal.vue'

defineProps<{
  message: string
}>()

defineEmits<{
  (e: 'hide'): void
}>()

defineComponent({
  name: 'AnimatedCat'
})
</script>

<style scoped>
.cat {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
  animation: bodyMove 3s infinite;
}

.cat-body {
  fill: #f4a460;
  stroke: #8b4513;
  stroke-width: 2;
}

.cat-ear {
  fill: #f4a460;
  stroke: #8b4513;
  stroke-width: 2;
}

.cat-eye {
  fill: #4a4a4a;
}

.cat-nose {
  fill: #ff69b4;
}

.cat-mouth {
  fill: none;
  stroke: #4a4a4a;
  stroke-width: 2;
}

.cat-whisker {
  stroke: #4a4a4a;
  stroke-width: 2;
}

.paw {
  transform-origin: 0 50%;
  animation: wave 1s infinite;
}

.paw-pad {
  fill: #f4a460;
  stroke: #8b4513;
  stroke-width: 2;
}

.paw-toe {
  fill: #f4a460;
  stroke: #8b4513;
  stroke-width: 2;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

@keyframes bodyMove {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style> 