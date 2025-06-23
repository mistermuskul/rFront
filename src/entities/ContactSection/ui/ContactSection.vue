<template>
  <section class="contact-section">
        <h2 class="section-title">Contact</h2>
        <div class="contact-info">
          <a href="mailto:your.email@example.com" class="contact-item">
            <i class="fas fa-envelope"></i> your.email@example.com
          </a>
          <a href="https://github.com/yourusername" class="contact-item">
            <i class="fab fa-github"></i> GitHub
          </a>
          <a href="https://linkedin.com/in/yourusername" class="contact-item">
            <i class="fab fa-linkedin"></i> LinkedIn
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
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.contact-item {
  color: #a8a8a8;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.contact-item:hover {
  color: #ffffff;
}

@media (max-width: 768px) {
  .contact-section {
    padding: 1.5rem;
  }
}
</style>