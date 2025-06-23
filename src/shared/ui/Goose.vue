<template>
  <AnimatedAnimal :message="message" @hide="$emit('hide')">
    <svg class="dog" viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <ellipse class="dog-body" cx="110" cy="120" rx="55" ry="35" />
      <!-- Head -->
      <ellipse class="dog-head" cx="70" cy="70" rx="35" ry="30" />
      <!-- Left ear -->
      <ellipse class="dog-ear" cx="45" cy="35" rx="12" ry="22" transform="rotate(-20 45 50)" />
      <!-- Right ear -->
      <ellipse class="dog-ear" cx="95" cy="35" rx="12" ry="22" transform="rotate(20 95 45)" />
      <!-- Eyes -->
      <circle class="dog-eye" cx="60" cy="70" r="4" />
      <circle class="dog-eye" cx="80" cy="70" r="4" />
      <!-- Nose -->
      <ellipse class="dog-nose" cx="70" cy="85" rx="5" ry="3" />
      <!-- Mouth -->
      <path class="dog-mouth" d="M65,90 Q70,95 75,90" />
      <!-- Tail (static) -->
      <path class="dog-tail" d="M160,120 Q200,100 170,140" />
      <!-- Legs -->
      <rect class="dog-leg" x="85" y="150" width="10" height="25" rx="4" />
      <rect class="dog-leg" x="125" y="150" width="10" height="25" rx="4" />
      <!-- Waving paw -->
      <g class="paw" transform="translate(150, 140)">
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
  name: 'AnimatedDog'
})
</script>

<style scoped>
.dog {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
  animation: bodyMove 3s infinite;
}

.dog-body {
  fill: #f5d6b4;
  stroke: #b48a60;
  stroke-width: 2;
}

.dog-head {
  fill: #f5d6b4;
  stroke: #b48a60;
  stroke-width: 2;
}

.dog-ear {
  fill: #b48a60;
  stroke: #8b5c2a;
  stroke-width: 2;
}

.dog-eye {
  fill: #222;
}

.dog-nose {
  fill: #222;
}

.dog-mouth {
  fill: none;
  stroke: #8b5c2a;
  stroke-width: 2;
}

.dog-tail {
  fill: none;
  stroke: #b48a60;
  stroke-width: 6;
  stroke-linecap: round;
}

.dog-leg {
  fill: #f5d6b4;
  stroke: #b48a60;
  stroke-width: 2;
}

.paw {
  transform-origin: 0 50%;
  animation: wave 1s infinite;
}

.paw-pad {
  fill: #f5d6b4;
  stroke: #b48a60;
  stroke-width: 2;
}

.paw-toe {
  fill: #f5d6b4;
  stroke: #b48a60;
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