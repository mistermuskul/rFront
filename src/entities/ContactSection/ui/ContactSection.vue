<template>
  <section class="contact-section">
    <h2 class="section-title">Контакты</h2>
    <div class="contact-info">
      <a href="mailto:valeragordienko_05012003@mail.ru" class="contact-item">
        <q-icon name="email" size="1.5rem" />
        <span>valeragordienko_05012003@mail.ru</span>
      </a>
      <a href="tel:+79180582755" class="contact-item">
        <q-icon name="phone" size="1.5rem" />
        <span>+7 (918) 058-27-55</span>
      </a>
      <a href="https://t.me/valeragordienko" class="contact-item" target="_blank" rel="noopener">
        <q-icon name="telegram" size="1.5rem" />
        <span>@valeragordienko</span>
      </a>
      <a href="https://github.com/mistermuskul/rFront" class="contact-item" target="_blank" rel="noopener">
        <q-icon name="code" size="1.5rem" />
        <span>Frontend Repository</span>
      </a>
      <a href="https://github.com/mistermuskul/rServer" class="contact-item" target="_blank" rel="noopener">
        <q-icon name="storage" size="1.5rem" />
        <span>Backend Repository</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
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

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.contact-item {
  color: #a8a8a8;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  font-size: 1rem;
  min-height: 60px;
}

.contact-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.contact-item span {
  flex: 1;
  word-break: break-word;
}

.contact-item .q-icon {
  color: #ffffff;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.contact-item:hover .q-icon {
  opacity: 1;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .contact-section {
    padding: 1.5rem;
  }
  
  .contact-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .contact-item {
    padding: 1rem;
    font-size: 0.9rem;
    min-height: 50px;
  }
}
</style>