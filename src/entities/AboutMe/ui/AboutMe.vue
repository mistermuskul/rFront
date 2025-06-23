<template>
<section class="about-section">
    <h2 class="section-title about-title">About Me</h2>
    <p class="about-text">
      Я — увлечённый разработчик с почти трёхлетним коммерческим опытом. Работаю Full Stack, основной стек: Vue 3, Quasar, TypeScript, Laravel, MySQL, а также Redis и RediSearch/GraphQL. Хорошо разбираюсь во множестве современных библиотек и инструментов фронтенда и бэкенда.<br><br>
      Имею высшее образование, быстро обучаюсь, умею находить решения для сложных задач и всегда стремлюсь к развитию. Считаю себя ответственным, инициативным и командным игроком. Готов приносить пользу вашей компании и расти вместе с ней!
    </p>
  </section>
</template>

<style scoped>
.about-section {
  margin: 4rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, transparent);
}

.about-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, transparent);
}

.about-text {
  color: #a8a8a8;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
}

@media (max-width: 768px) {
  .about-section {
    padding: 1.5rem;
  }
}
</style>