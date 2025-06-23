<template>
     <section class="experience-section">
        <h2 class="section-title">Опыт работы</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-content">
              <h3>Product Manager</h3>
              <p class="company">2022 — 2023</p>
              <p class="period">1 год</p>
              <p class="description">
                Работал менеджером проектов: организация процессов, постановка задач, контроль сроков и коммуникация с командой. Успешно реализовал несколько проектов в роли продукт-менеджера.
              </p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-content">
              <h3>Full Stack Developer</h3>
              <p class="company">2023 —  настоящее время</p>
              <p class="period">2 года</p>
              <p class="description">
                Разработка и поддержка терминалов самообслуживания (мойки, магазины, парковки, заправки), CRM-систем, админ-панелей и веб-сервисов. Внедрение новых функций, интеграция с внешними сервисами, оптимизация процессов.
              </p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-content">
              <h3>Full Stack Developer</h3>
              <p class="company">2024 — настоящее время</p>
              <p class="period">почти 1 год</p>
              <p class="description">
                Разработка крупной CRM-системы для сотрудников компании (аналитики, менеджеры). Многоуровневая работа с API, обработка больших объёмов данных, оптимизация тяжёлых запросов, загрузка и анализ проектов, построение сложных интерфейсов.
              </p>
            </div>
          </div>
        </div>
      </section>

</template>

<style scoped>
.experience-section {
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

.timeline {
  position: relative;
}

.timeline-item {
  margin-bottom: 2rem;
  position: relative;
  padding-left: 2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #ffffff, transparent);
}

.timeline-content {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
}

.timeline-content h3 {
  color: #ffffff;
  margin: 0 0 0.5rem 0;
}

.company {
  color: #a8a8a8;
  font-weight: 500;
  margin: 0;
}

.period {
  color: #888;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.description {
  color: #a8a8a8;
  margin: 1rem 0 0 0;
}

@media (max-width: 768px) {
  .experience-section {
    padding: 1.5rem;
  }
}
</style>