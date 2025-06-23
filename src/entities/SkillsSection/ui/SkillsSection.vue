<template>
  <section class="skills-section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-grid">
          <div class="skill-category">
            <h3>Frontend</h3>
            <ul>
              <li>Vue.js</li>
              <li>Quasar</li>
              <li>Vuetify</li>
              <li>OpenLayers</li>
              <li>TypeScript</li>
              <li>JavaScript</li>
              <li>HTML5/CSS3</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Backend</h3>
            <ul>
              <li>Laravel</li>
              <li>PHP</li>
              <li>Express.js</li>
              <li>SQL/NoSQL</li>
              <li>REST APIs</li>
              <li>MoonShine</li>
            </ul>
          </div>
        </div>
      </section>
</template>

<style scoped>
.skills-section {
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-category {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
}

.skill-category h3 {
  color: #ffffff;
  margin-bottom: 1rem;
}

.skill-category ul {
  list-style: none;
  padding: 0;
}

.skill-category li {
  color: #a8a8a8;
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.skill-category li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: #ffffff;
}

@media (max-width: 768px) {
  .skills-section {
    padding: 1.5rem;
  }
}
</style>