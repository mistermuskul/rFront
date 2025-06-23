<template>
  <div class="animated-animals">
    <Cat
      v-if="currentAnimal === 'cat'"
      :message="currentMessage"
      @hide="handleHide"
    />
    <Goose
      v-if="currentAnimal === 'goose'"
      :message="currentMessage"
      @hide="handleHide"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Cat from './Cat.vue'
import Goose from './Goose.vue'

const animals = ['cat', 'goose'] as const
const messages = {
    cat: [
    'Здравствуйте! Готов работать и развиваться в вашей компании.',
    'У меня есть опыт и желание приносить пользу вашей команде.',
    'Рассмотрите мою кандидатуру — уверен, смогу быть полезен!',
    'Открыт к новым задачам и быстро обучаюсь.',
    'Буду рад пройти собеседование и обсудить детали сотрудничества.'
  ],
  goose: [
    'Добрый день! Заинтересован в вашей вакансии.',
    'Готов применить свои навыки для достижения общих целей.',
    'Ответственно подхожу к работе и открыт к новым вызовам.',
    'Считаю, что могу внести вклад в развитие вашей компании.',
    'Буду рад стать частью вашей команды!'
  ]
}

const currentAnimal = ref<typeof animals[number] | null>(null)
const currentMessage = ref('')

const showRandomAnimal = () => {
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)]
  const randomMessage = messages[randomAnimal][Math.floor(Math.random() * messages[randomAnimal].length)]
  
  currentAnimal.value = randomAnimal
  currentMessage.value = randomMessage
}

const handleHide = () => {
  currentAnimal.value = null
  setTimeout(showRandomAnimal, 10000)
}

onMounted(() => {
  setTimeout(showRandomAnimal, 10000)
})
</script>

<style scoped>
.animated-animals {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.animated-animals > * {
  pointer-events: auto;
}
</style> 